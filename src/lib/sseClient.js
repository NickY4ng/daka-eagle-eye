/**
 * 简单 SSE 客户端封装（支持自动重连 + 通用 onmessage + 自定义 eventType 监听）
 * @example
 * const client = new SSEClient({ url, onMessage: (data)=>{} })
 */
export class SSEClient {
    /**
     * 配置项（将 `SSEClientOptions` 与默认值合并后用于驱动连接、重连与回调）
     */
    options;

    /**
     * 当前连接状态：`closed`（未连接/已关闭）、`connecting`（连接中）、`open`（已连接）
     */
    status = 'closed';

    /**
     * 原生 EventSource 实例；连接关闭后会置空，避免重复使用旧连接
     */
    eventSource = null;

    /**
     * 已重连次数（用于判断是否超过 `maxReconnectTimes`）
     */
    reconnectCount = 0;

    /**
     * 重连定时器（用于延迟重连、并在关闭时清理）
     */
    reconnectTimer = null;

    /**
     * 用于 `on/off` 自定义事件：
     * 保存 callback -> wrappedListener 的映射，确保 off 能正确移除监听器
     */
    customListenerMap = new Map();

    constructor(options) {
        if (!options?.url) {
            throw new Error('SSEClient: url is required');
        }

        /**
         * 合并并规范化 options：为未提供的字段补默认值，保证后续 connect/重连/回调逻辑可直接使用。
         */
        this.options = {
            // EventSource 原生不支持自定义 headers；这里保留兼容位
            headers: options.headers ?? {},
            // 重连间隔（毫秒）
            reconnectInterval: options.reconnectInterval ?? 3000,
            // 最大重连次数，-1 表示无限
            maxReconnectTimes: options.maxReconnectTimes ?? -1,
            // 是否自动重连
            autoReconnect: options.autoReconnect ?? true,
            // 用于拼接 URL（如加时间戳）
            method: options.method ?? 'GET',
            // 连接建立回调
            onOpen: options.onOpen ?? (() => {}),
            // 通用消息回调
            onMessage: options.onMessage ?? (() => {}),
            // 错误回调
            onError: options.onError ?? (() => {}),
            // 重连触发回调
            onReconnect: options.onReconnect ?? (() => {}),
            // 手动关闭回调
            onClose: options.onClose ?? (() => {}),
            // 自定义解析函数（默认 JSON.parse析）
            parser: options.parser ?? ((raw) => {
                try {
                    return JSON.parse(raw);
                } catch {
                    // 非 JSON 格式：尽量按 T 返回（由调用方保证一致性）
                    return raw;
                }
            }),
            url: options.url,
        };

        this.connect();
    }

    /**
     * 创建连接
     */
    connect() {
        if (this.status === 'connecting' || this.status === 'open') return;

        this.status = 'connecting';
        try {
            // EventSource 原生不支持自定义 headers；这里保留 withCredentials 作为兼容选项
            this.eventSource = new EventSource(this.buildUrl(), { withCredentials: true });

            this.eventSource.onopen = (e) => {
                this.status = 'open';
                this.reconnectCount = 0;
                this.options.onOpen(e);
            };

            this.eventSource.onmessage = (e) => {
                const data = this.options.parser(e.data);
                this.options.onMessage(data, e);
            };

            this.eventSource.onerror = (error) => {
                // EventSource 在异常时会触发 onerror；此处切换状态并走重连
                this.status = 'closed';
                this.options.onError(error);
                this.handleReconnect();
            };
        } catch (error) {
            this.status = 'closed';
            this.options.onError(error);
            this.handleReconnect();
        }
    }

    /**
     * 处理重连逻辑
     */
    handleReconnect() {
        if (!this.options.autoReconnect) {
            this.options.onClose();
            return;
        }

        if ( this.options.maxReconnectTimes !== -1 && this.reconnectCount >= this.options.maxReconnectTimes) {
            this.options.onClose();
            return;
        }

        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectCount++;
            this.options.onReconnect(this.reconnectCount, this.options.maxReconnectTimes);
            this.connect();
        }, this.options.reconnectInterval);
    }

    /**
     * 构建请求 URL（示例：GET 拼接时间戳避免缓存）
     */
    buildUrl() {
        const { url, method } = this.options;
        return method.toUpperCase() === 'GET' ? `${url}?t=${Date.now()}` : url;
    }

    /**
     * 监听自定义类型消息
     */
    on(eventType, callback) {
        if (!this.eventSource) return;

        const wrapped = (e) => {
            const me = e;
            const data = this.options.parser(me.data);
            callback(data, me);
        };

        if (!this.customListenerMap.has(eventType)) {
            this.customListenerMap.set(eventType, new Map());
        }
        this.customListenerMap.get(eventType).set(callback, wrapped);

        this.eventSource.addEventListener(eventType, wrapped);
    }

    /**
     * 移除自定义类型消息监听
     */
    off(eventType, callback) {
        if (!this.eventSource) return;
        const byEvent = this.customListenerMap.get(eventType);
        const wrapped = byEvent?.get(callback);
        if (wrapped) {
            this.eventSource.removeEventListener(eventType, wrapped);
            byEvent?.delete(callback);
        }
    }

    /**
     * 手动关闭连接
     */
    close() {
        this.options.autoReconnect = false;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;

        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }

        this.status = 'closed';
        this.options.onClose();
    }

    /**
     * 获取当前连接状态
     */
    getStatus() {
        return this.status;
    }
}
