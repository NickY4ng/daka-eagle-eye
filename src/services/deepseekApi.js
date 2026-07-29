/**
 * DeepSeek API 客户端 — 通过 Vite 代理调用 DeepSeek Anthropic 兼容接口
 *
 * Base URL:  https://api.deepseek.com/anthropic/v1/messages
 * Proxy:     /deepseek/anthropic/v1/messages  (vite.config.js 中配置)
 * Auth:      x-api-key header
 *
 * 使用方式：
 *   import { sendMessage, sendMessageStream } from '@/services/deepseekApi.js'
 *   const reply = await sendMessage(conversationHistory, { model: 'deepseek-chat' })
 */

// ========================= 配置 =========================

const DEEPSEEK_API_KEY = ''; // 纯演示模式，无需 API Key
const DEEPSEEK_BASE = '/deepseek/anthropic/v1/messages';

/** DeepSeek 可用模型 (Anthropic 兼容端点) */
export const DEEPSEEK_MODELS = [
    { id: 'deepseek-v4-flash',   label: 'DeepSeek V4 Flash',  desc: '极速响应，日常对话' },
    { id: 'deepseek-v4-pro',     label: 'DeepSeek V4 Pro',    desc: '深度推理，复杂分析' },
];

// ========================= 系统提示词 =========================

const SYSTEM_PROMPT = `# 物流决策分析智能体

## 角色定位
你是智能分析助手，专注于重卡货运数据的专业分析。你帮助用户理解货运数据、分析物流趋势、生成数据洞察。

## 核心能力
基于虚拟运单数据，提供专业分析服务：
- 货物流向深度分析（区域间、城市间、企业间流向特征）
- 运输成本结构分析（吨公里成本、线路成本、车型成本）
- 车辆效率评估（装卸时长、运输时效、周转率、利用率）
- 供应链网络分析（企业上下游关系、合作伙伴、网络密度）
- 时间趋势分析（时段分布、季节性变化、趋势预测）
- 路线优化分析（里程结构、途经分析、效率评估）
- 企业画像分析（运输特征、成本特征、效率特征）
- 货类特征分析（各类货物的运输规律、成本特征）

## 可用数据字段
【运单基础】order_id, grade, load_status
【车辆信息】vid, vehicle_type, vehicle_type_marking, limit_load, actual_load
【货物信息】goods_code_name, goods_type
【发货方】shipper, shipper_province/city/county_name, shipper_industry_category
【收货方】consignee, consignee_province/city/county_name, consignee_industry_category
【时间信息】load_start/end_time, unload_start/end_time, all_time
【成本里程】all_cost, all_mile, highway_mile, country_mile
【途经信息】pass_province/city/county_name

## 回答要求
- 数据洞察要有数据支撑，不要空泛
- 如涉及地区/货类排名，给出TOP列表
- 对异常数据（极高/极低值）要特别标注
- 回答简洁专业，避免过度修饰
- 如果是分析类问题，最后给出总结和建议`;

// ========================= 工具函数 =========================

/**
 * 将前端消息格式转为 Anthropic Messages API 格式
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Array<{role: string, content: string}>}
 */
function toAnthropicMessages(messages) {
    return messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
            role: m.role,
            content: m.content || '',
        }));
}

// ========================= 核心 API =========================

/**
 * 发送消息（非流式），返回完整回复
 *
 * @param {Array<{role:string, content:string}>} messages - 完整对话历史
 * @param {Object} options
 * @param {string}  options.model     - 模型 ID，默认 deepseek-chat
 * @param {number}  options.maxTokens - 最大输出 token，默认 4096
 * @returns {Promise<string>} AI 回复文本
 */
export async function sendMessage(messages, options = {}) {
    const body = {
        model: options.model || 'deepseek-v4-flash',
        max_tokens: options.maxTokens || 4096,
        system: SYSTEM_PROMPT,
        messages: toAnthropicMessages(messages),
    };

    const response = await fetch(DEEPSEEK_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': DEEPSEEK_API_KEY,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`DeepSeek API 错误 (${response.status}): ${text}`);
    }

    const data = await response.json();

    // Anthropic Messages API 格式: { content: [{ type: "text", text: "..." }], ... }
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    return textBlocks.map(b => b.text).join('\n');
}

/**
 * 发送消息（流式），通过回调逐步返回文本片段
 *
 * @param {Array<{role:string, content:string}>} messages
 * @param {Object} options
 * @param {string}  options.model
 * @param {number}  options.maxTokens
 * @param {(delta: string) => void} onDelta  - 每次收到新文本时调用
 * @param {() => void}               onDone  - 流结束时调用
 * @param {(err: Error) => void}     onError - 出错时调用
 * @returns {Promise<void>}
 */
export async function sendMessageStream(messages, options = {}) {
    const { onDelta, onDone, onError } = options;

    const body = {
        model: options.model || 'deepseek-v4-flash',
        max_tokens: options.maxTokens || 4096,
        system: options.systemPrompt || SYSTEM_PROMPT,
        messages: toAnthropicMessages(messages),
        stream: true,
    };

    let response;
    try {
        response = await fetch(DEEPSEEK_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': DEEPSEEK_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
        });
    } catch (err) {
        onError?.(err instanceof Error ? err : new Error('网络请求失败'));
        return;
    }

    if (!response.ok) {
        const text = await response.text().catch(() => '');
        onError?.(new Error(`DeepSeek API 错误 (${response.status}): ${text}`));
        return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
        onError?.(new Error('浏览器不支持流式读取'));
        return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留最后不完整的行

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const jsonStr = line.slice(6).trim();
                if (!jsonStr) continue;

                try {
                    const event = JSON.parse(jsonStr);

                    // Anthropic 流式事件类型
                    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
                        onDelta?.(event.delta.text);
                    }
                    // 兼容 OpenAI 格式: choices[0].delta.content
                    if (event.choices?.[0]?.delta?.content) {
                        onDelta?.(event.choices[0].delta.content);
                    }
                } catch {
                    // 忽略解析失败的行
                }
            }
        }
        onDone?.();
    } catch (err) {
        onError?.(err instanceof Error ? err : new Error('流式读取中断'));
    } finally {
        reader.releaseLock();
    }
}
