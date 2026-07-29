/**
 * Hermes Dashboard WebSocket 客户端
 *
 * 连接本地 Hermes Dashboard (端口 9119)，通过 JSON-RPC 2.0 over WebSocket 对话。
 * fallback: DeepSeek API
 *
 * 协议：ws://localhost:9119/api/ws
 *
 * 流程：
 *   1. 连接 WebSocket
 *   2. 收到 gateway.ready
 *   3. 发送 session.create → 获取 session_id
 *   4. 发送 prompt.submit → 流式接收 message.delta / message.complete
 *
 * 使用方式：
 *   import { connectHermes, sendHermesMessage } from '@/services/hermesWsApi.js'
 */

// ========================= 配置 =========================

// 通过 Vite 代理连接 Hermes Dashboard（/hermes-api → localhost:9119）
// 所有请求（HTTP + WebSocket）走同源代理，零跨域问题
const PROXY_PREFIX = '/hermes-api';

// 从 Hermes Dashboard 页面提取 session token，然后连接 WebSocket
let _sessionToken = null;

async function getSessionToken() {
    if (_sessionToken) return _sessionToken;
    try {
        const resp = await fetch(`${PROXY_PREFIX}/`, { signal: AbortSignal.timeout(3000) });
        const html = await resp.text();
        const match = html.match(/__HERMES_SESSION_TOKEN__\s*=\s*"([^"]+)"/);
        if (match) {
            _sessionToken = match[1];
            console.log('[Hermes WS] 获取 token 成功');
            return _sessionToken;
        }
    } catch (e) {
        console.warn('[Hermes WS] 获取 token 失败:', e.message);
    }
    return null;
}

function getWsUrl() {
    // WS 也通过 Vite 代理（vite.config.js 的 ws:true 会自动升级）
    const { protocol, host } = window.location;
    const wsProto = protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${host}${PROXY_PREFIX}/api/ws?token=${_sessionToken}`;
}

// ========================= 状态 =========================

let _ws = null;
let _sessionId = null;
let _requestId = 0;
let _pendingRequests = new Map(); // id → { resolve, reject }
let _connected = false;
let _connecting = false;
let _connectPromise = null;
let _connectResolve = null; // resolve function for connectPromise
let _onMessageDelta = null; // callback for message.delta events
let _onMessageComplete = null;
let _onError = null;

// ========================= 连接管理 =========================

/**
 * 检测 Hermes Dashboard 是否在运行
 */
export async function checkHermesDashboard() {
    try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 2000);
        const resp = await fetch(`${PROXY_PREFIX}/api/status`, { signal: controller.signal });
        clearTimeout(t);
        return resp.ok;
    } catch (e) {
        console.warn('[Hermes] Dashboard 检测失败:', e.message);
        return false;
    }
}

export function isHermesConnected() {
    return _connected && _ws?.readyState === WebSocket.OPEN;
}

/**
 * 连接到 Hermes Dashboard WebSocket
 * @returns {Promise<boolean>} 是否连接成功
 */
export function connectHermes() {
    if (_connected && _ws?.readyState === WebSocket.OPEN) {
        return Promise.resolve(true);
    }

    if (_connecting && _connectPromise) {
        return _connectPromise;
    }

    _connecting = true;
    _connectPromise = (async function () {
        const token = await getSessionToken();
        if (!token) {
            console.warn('[Hermes WS] 无法获取 session token');
            _connecting = false;
            _connectPromise = null;
            return false;
        }

        return new Promise((resolve) => {
            _connectResolve = resolve;

            try {
                _ws = new WebSocket(getWsUrl());
            } catch (err) {
                console.warn('[Hermes WS] 创建 WebSocket 失败:', err.message);
                _connecting = false;
                _connectPromise = null;
                _connectResolve = null;
                resolve(false);
                return;
            }

            const timeout = setTimeout(() => {
                if (!_connected) {
                    console.warn('[Hermes WS] 连接超时');
                    _ws?.close();
                    _connecting = false;
                    _connectPromise = null;
                    _connectResolve = null;
                    resolve(false);
                }
            }, 5000);

            _ws.onopen = () => {
                console.log('[Hermes WS] WebSocket 已连接，等待 gateway.ready...');
            };

            _ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    _handleMessage(msg);
                } catch (e) {
                    // 忽略解析失败
                }
            };

            _ws.onclose = (event) => {
                console.log(`[Hermes WS] 连接关闭 code=${event.code} reason=${event.reason}`);
                if (!_connected && _connectResolve) {
                    _connectResolve(false);
                    _connectResolve = null;
                }
                _connected = false;
                _sessionId = null;
                _pendingRequests.forEach(({ reject }) => {
                    reject(new Error('WebSocket 连接已断开'));
                });
                _pendingRequests.clear();
                _connecting = false;
                _connectPromise = null;
            };

            _ws.onerror = (err) => {
                console.error('[Hermes WS] WebSocket 错误:', err);
                _connected = false;
                clearTimeout(timeout);
                _connecting = false;
                _connectPromise = null;
                if (_connectResolve) {
                    _connectResolve(false);
                    _connectResolve = null;
                }
            };
        });
    })();

    return _connectPromise;
}

// ========================= 消息处理 =========================

function _handleMessage(msg) {
    const { id, method, params, result, error } = msg;

    // 1. gateway.ready 事件 — 标记连接成功
    if (method === 'event' && params?.type === 'gateway.ready') {
        _connected = true;
        _connecting = false;
        console.log('[Hermes WS] Gateway 就绪');
        if (_connectResolve) {
            _connectResolve(true);
            _connectResolve = null;
        }
        return;
    }

    // 2. 事件通知（流式内容）
    if (method === 'event' && params?.type) {
        const eventType = params.type;
        const payload = params.payload || {};

        switch (eventType) {
            case 'message.delta':
                if (_onMessageDelta && payload.text) {
                    _onMessageDelta(payload.text);
                }
                break;

            case 'message.complete':
                if (_onMessageComplete) {
                    _onMessageComplete(payload.text || '');
                }
                break;

            case 'thinking.delta':
            case 'reasoning.delta':
                // 思考过程，可以选择性展示
                break;

            case 'status.update':
                console.log('[Hermes]', payload.kind, payload.text?.slice(0, 80));
                break;

            case 'error':
                if (_onError && payload.message) {
                    _onError(new Error(payload.message));
                }
                break;

            case 'session.info':
                console.log('[Hermes] Session info:', payload.model);
                break;

            default:
                break;
        }
        return;
    }

    // 3. RPC 响应
    const requestId = id;
    if (requestId !== undefined && _pendingRequests.has(requestId)) {
        const { resolve, reject } = _pendingRequests.get(requestId);
        _pendingRequests.delete(requestId);

        if (error) {
            reject(new Error(error.message || `RPC Error ${error.code}`));
        } else {
            resolve(result);
        }
    }
}

function _sendRpc(method, params = {}) {
    return new Promise((resolve, reject) => {
        if (!_ws || _ws.readyState !== WebSocket.OPEN) {
            reject(new Error('WebSocket 未连接'));
            return;
        }

        const id = String(++_requestId);
        _pendingRequests.set(id, { resolve, reject });

        const request = {
            jsonrpc: '2.0',
            id,
            method,
            params,
        };

        try {
            _ws.send(JSON.stringify(request));
        } catch (err) {
            _pendingRequests.delete(id);
            reject(err);
        }

        // 超时处理
        setTimeout(() => {
            if (_pendingRequests.has(id)) {
                _pendingRequests.delete(id);
                reject(new Error(`RPC ${method} 超时`));
            }
        }, 30000);
    });
}

// ========================= 对话 API =========================

/**
 * 创建会话（可传入已有的对话历史作为种子）
 * @param {string} title
 * @param {Array} seedMessages - 已有的对话历史
 */
export async function createSession(title = '', seedMessages = []) {
    if (!_sessionId) {
        const params = {
            title: title || '大卡鹰眼对话',
            source: 'web',
        };
        // 如果有历史消息，传入作为种子
        if (seedMessages.length > 0) {
            params.messages = seedMessages.filter(m =>
                m.role === 'user' || m.role === 'assistant'
            );
        }
        const result = await _sendRpc('session.create', params);
        _sessionId = result.session_id;
        console.log('[Hermes WS] Session created:', _sessionId);
    }
    return _sessionId;
}

/**
 * 发送流式消息
 *
 * @param {Array} messages - 对话历史（首次发送为空或仅一条用户消息）
 * @param {Object} options
 * @param {string} options.model
 * @param {(delta: string) => void} options.onDelta
 * @param {() => void} options.onDone
 * @param {(err: Error) => void} options.onError
 */
export async function sendMessageStream(messages, options = {}) {
    const { onDelta, onDone, onError } = options;

    if (!isHermesConnected()) {
        // Fallback to DeepSeek
        const { sendMessageStream: deepseekStream } = await import('@/services/deepseekApi.js');
        await deepseekStream(messages, options);
        return;
    }

    // 设置回调
    _onMessageDelta = onDelta || null;
    _onMessageComplete = (summary) => {
        onDone?.();
        _onMessageDelta = null;
        _onMessageComplete = null;
        _onError = null;
    };
    _onError = (err) => {
        onError?.(err);
        _onMessageDelta = null;
        _onMessageComplete = null;
        _onError = null;
    };

    try {
        // 提取最后一条用户消息作为 prompt
        const userMessages = messages.filter(m => m.role === 'user');
        const lastUserMsg = userMessages[userMessages.length - 1];
        const text = lastUserMsg?.content || '';

        if (!text.trim()) {
            onDone?.();
            return;
        }

        // 如果还没有 session，创建一个，并传入之前的对话历史作为种子
        if (!_sessionId) {
            // 之前的消息（不含最后一条用户消息）作为种子历史
            const lastUserIdx = messages.indexOf(lastUserMsg);
            const seedHistory = lastUserIdx > 0 ? messages.slice(0, lastUserIdx) : [];
            await createSession(undefined, seedHistory);
        }

        // 发送 prompt.submit
        await _sendRpc('prompt.submit', {
            session_id: _sessionId,
            text: text,
        });
        // 响应通过事件回调异步处理（_onMessageDelta / _onMessageComplete）

    } catch (err) {
        onError?.(err);
        _onMessageDelta = null;
        _onMessageComplete = null;
        _onError = null;
    }
}

/**
 * 断开连接
 */
export function disconnectHermes() {
    _connected = false;
    _sessionId = null;
    if (_ws) {
        _ws.close();
        _ws = null;
    }
}

// ========================= 文件支持 =========================

export function buildMessageWithFiles(userMessage, fileContents = []) {
    if (!fileContents || fileContents.length === 0) {
        return userMessage;
    }

    const fileContexts = fileContents.map(f => {
        const truncateLength = 10000;
        let content = f.content;
        let note = '';
        if (content.length > truncateLength) {
            content = content.slice(0, truncateLength);
            note = `\n... (文件内容已截断，原始大小 ${f.content.length} 字符)`;
        }
        return `\`\`\`文件: ${f.name}\n${content}${note}\n\`\`\``;
    }).join('\n\n');

    return `以下是用户上传的文件内容：\n\n${fileContexts}\n\n---\n用户问题：${userMessage}`;
}
