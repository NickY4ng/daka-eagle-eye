/**
 * 【实现需求：深度分析Agent API，使用独立的应用ID和提示词】
 * 【输入：用户问题文本 | 输出：AI 回答文本（严格三阶段对话，最终输出HTML报告） | 约束：使用深度分析专用应用ID和API Key，支持会话保持】
 */

const APP_ID = 'dc7df2d0429e490d9ee0e641f323a9cf';
const API_KEY = 'sk-4799bdec97094b54b6711b185e4a6686';
const API_URL = `https://dashscope.aliyuncs.com/api/v1/apps/${APP_ID}/completion`;
const DEEP_ANALYSIS_SESSION_KEY = 'deep_analysis_session_id';
const DEEP_ANALYSIS_MESSAGE_COUNT_KEY = 'deep_analysis_message_count';
const MAX_MESSAGE_COUNT = 30;

// 【深度分析系统提示词 - 优化版】
const DEEP_ANALYSIS_SYSTEM_PROMPT = `# 深度分析专家

## 角色定位
你是深度分析专家，专注于虚拟运单数据的专业深度分析。你像一位资深的数据分析顾问，帮助用户明确分析目标，输出专业级的HTML分析报告。

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

请现在开始，等待用户提出深度分析需求。`;

/**
 * 【输入：无 | 输出：sessionId字符串或null | 约束：从localStorage读取会话ID】
 */
function getSessionId() {
    return localStorage.getItem(DEEP_ANALYSIS_SESSION_KEY);
}

/**
 * 【输入：sessionId字符串或null | 输出：无 | 约束：保存或清除localStorage中的会话ID】
 */
function setSessionId(sessionId) {
    if (sessionId) {
        localStorage.setItem(DEEP_ANALYSIS_SESSION_KEY, sessionId);
    } else {
        localStorage.removeItem(DEEP_ANALYSIS_SESSION_KEY);
    }
}

/**
 * 【输入：无 | 输出：消息轮数数字 | 约束：从localStorage读取消息计数，默认为0】
 */
function getMessageCount() {
    const count = localStorage.getItem(DEEP_ANALYSIS_MESSAGE_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
}

/**
 * 【输入：消息轮数数字 | 约束：保存消息计数到localStorage】
 */
function setMessageCount(count) {
    localStorage.setItem(DEEP_ANALYSIS_MESSAGE_COUNT_KEY, count.toString());
}

/**
 * 【输入：无 | 输出：无 | 约束：清除深度分析会话ID和消息计数，创建新会话】
 */
export function clearDeepAnalysisSession() {
    console.log('[深度分析API] 清除会话ID前:', localStorage.getItem(DEEP_ANALYSIS_SESSION_KEY));
    localStorage.removeItem(DEEP_ANALYSIS_SESSION_KEY);
    localStorage.removeItem(DEEP_ANALYSIS_MESSAGE_COUNT_KEY);
    console.log('[深度分析API] 清除会话ID后:', localStorage.getItem(DEEP_ANALYSIS_SESSION_KEY));
}

/**
 * 【输入：用户问题字符串 | 输出：AI 回答字符串 | 约束：使用阿里云百炼 API，保持会话上下文，超过30轮自动重置会话】
 */
export async function callDeepAnalysisAgent(prompt) {
    try {
        let sessionId = getSessionId();
        let messageCount = getMessageCount();

        // 如果消息轮数超过限制，重置会话
        if (messageCount >= MAX_MESSAGE_COUNT) {
            clearDeepAnalysisSession();
            sessionId = null;
            messageCount = 0;
        }

        // 【优化：只有新会话（无sessionId）时才发送系统提示词】
        // 有sessionId说明是继续对话，只需发送用户问题，上下文会自动保持
        const fullPrompt = sessionId
            ? prompt  // 继续对话，只发送用户问题
            : `${DEEP_ANALYSIS_SYSTEM_PROMPT}\n\n=== 用户问题 ===\n${prompt}`;  // 新会话，发送系统提示词+用户问题

        // 【调试日志】
        console.log('[深度分析API] sessionId:', sessionId);
        console.log('[深度分析API] 是否新会话:', !sessionId);
        console.log('[深度分析API] 系统提示词长度:', DEEP_ANALYSIS_SYSTEM_PROMPT.length);
        console.log('[深度分析API] 完整prompt长度:', fullPrompt.length);
        console.log('[深度分析API] 完整prompt前200字符:', fullPrompt.substring(0, 200));

        const requestBody = {
            input: {
                prompt: fullPrompt,
                session_id: sessionId || undefined,
            },
            parameters: {
                incremental_output: false,
            },
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.code) {
            throw new Error(`API 错误: ${data.code} - ${data.message}`);
        }

        if (data.output?.text) {
            // 保存会话ID
            if (data.output.session_id) {
                setSessionId(data.output.session_id);
            }
            // 增加消息计数
            setMessageCount(messageCount + 1);
            return data.output.text;
        }

        throw new Error('API 返回数据格式异常');
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('网络请求失败，请检查网络连接');
    }
}

/**
 * 【输入：HTML字符串 | 输出：无 | 约束：触发浏览器下载HTML文件】
 */
export function downloadHtmlReport(html, filename = '深度分析报告.html') {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 【输入：文本内容 | 输出：布尔值 | 约束：判断内容是否为HTML报告（必须包含完整的HTML文档结构）】
 */
export function isHtmlReport(content) {
    // 严格判断：必须包含完整的HTML文档结构
    const hasHtmlStructure = content.includes('<!DOCTYPE html>') || 
                           content.includes('<html') || 
                           (content.includes('<head>') && content.includes('<body>'));
    // 同时长度要足够长（至少10000字符，确保是真正的HTML报告而不是简单的HTML标签）
    const isLongContent = content.length > 10000;
    // 必须同时满足：有HTML结构 且 长度足够
    return hasHtmlStructure && isLongContent;
}
