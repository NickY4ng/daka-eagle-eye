/**
 * 输出解析器 — 从消息流中检测结构化标记，提取可渲染内容
 *
 * 支持的标记：
 *   [CARD] + JSON      → type: 'card'      需求确认卡
 *   [FRAMEWORK] + JSON → type: 'framework'  分析思路/指标框架
 *   [REPORT] + HTML    → type: 'html'       Demo 报告
 *   [SQL] + SQL        → type: 'sql'        SQL 脚本
 *
 * 使用方式：
 *   const { currentOutput } = useOutputParser(messages)
 *   // currentOutput 是一个 computed，跟随消息流自动变化
 */

import { computed } from 'vue';

// ========================= 提取函数 =========================

/**
 * 从文本中提取 [CARD] 标记后的 JSON
 */
function extractCard(text) {
    const idx = text.lastIndexOf('[CARD]');
    if (idx === -1) return null;
    const after = text.slice(idx + 6);
    // 尝试匹配 JSON 对象
    const match = after.match(/\{[\s\S]*?\}/);
    if (!match) return null;
    try {
        const card = JSON.parse(match[0]);
        // 验证必要字段
        const keys = ['分析对象','分析范围','时间范围','分析场景','核心问题'];
        const hasSome = keys.some(k => card[k] !== undefined);
        if (!hasSome) return null;
        return {
            type: 'card',
            title: '需求确认卡',
            content: card,
            raw: match[0],
        };
    } catch {
        return null;
    }
}

/**
 * 从文本中提取 [FRAMEWORK] 标记后的 JSON
 */
function extractFramework(text) {
    const idx = text.lastIndexOf('[FRAMEWORK]');
    if (idx === -1) return null;
    const after = text.slice(idx + 12);
    // 尝试从代码块中提取 JSON
    const codeMatch = after.match(/```(?:json)?\s*([\s\S]*?)```/);
    let jsonStr;
    if (codeMatch) {
        jsonStr = codeMatch[1].trim();
    } else {
        // 尝试直接匹配 JSON 对象
        const match = after.match(/\{[\s\S]*?\}/);
        if (!match) return null;
        jsonStr = match[0];
    }
    try {
        const framework = JSON.parse(jsonStr);
        if (!framework.标题 && !framework.标题 && !framework.分析拆解 && !framework.维度) {
            // 尝试兼容中文 key
            if (!framework['标题'] && !framework['分析拆解'] && !framework['维度']) return null;
        }
        const title = framework.标题 || framework.title || '分析框架';
        const desc = framework.框架说明 || framework.需求理解 || '';
        return {
            type: 'framework',
            title: title,
            content: framework,
            desc: desc,
            raw: jsonStr,
        };
    } catch {
        return null;
    }
}

/**
 * 从文本中提取 [REPORT] 标记后的 HTML
 */
function extractReport(text) {
    const idx = text.lastIndexOf('[REPORT]');
    if (idx === -1) return null;
    const after = text.slice(idx + 8);
    // 从代码块中提取 HTML
    const codeMatch = after.match(/```(?:html)?\s*([\s\S]*?)```/);
    if (codeMatch) {
        const html = codeMatch[1].trim();
        if (html.includes('<!DOCTYPE') || html.includes('<html')) {
            return {
                type: 'html',
                title: 'Demo 报告',
                content: html,
                raw: html,
            };
        }
    }
    // 尝试直接提取 HTML 文档（从 <!DOCTYPE 到 </html>）
    const directMatch = after.match(/(<!DOCTYPE[\s\S]*?<\/html>)/i);
    if (directMatch) {
        return {
            type: 'html',
            title: 'Demo 报告',
            content: directMatch[0],
            raw: directMatch[0],
        };
    }
    return null;
}

/**
 * 从文本中提取 [SQL] 标记后的 SQL
 */
function extractSql(text) {
    const idx = text.lastIndexOf('[SQL]');
    if (idx === -1) return null;
    const after = text.slice(idx + 5);
    // 从代码块中提取 SQL
    const codeMatch = after.match(/```(?:sql)?\s*([\s\S]*?)```/);
    if (codeMatch) {
        const sql = codeMatch[1].trim();
        if (sql.length > 10) {
            return {
                type: 'sql',
                title: 'SQL 脚本',
                content: sql,
                raw: sql,
            };
        }
    }
    return null;
}

// ========================= 降级检测（无标记但有内容）=========================

function extractImplicit(text) {
    // 如果没有任何标记，尝试检测自然出现的结构化内容
    // 检测大段 HTML
    const htmlMatch = text.match(/```html\s*([\s\S]{500,}?)```/);
    if (htmlMatch && (htmlMatch[1].includes('<!DOCTYPE') || htmlMatch[1].includes('<html'))) {
        return {
            type: 'html',
            title: 'HTML 报告',
            content: htmlMatch[1].trim(),
            raw: htmlMatch[1].trim(),
        };
    }
    // 检测 SQL 代码块
    const sqlMatch = text.match(/```sql\s*([\s\S]{50,}?)```/);
    if (sqlMatch) {
        return {
            type: 'sql',
            title: 'SQL 脚本',
            content: sqlMatch[1].trim(),
            raw: sqlMatch[1].trim(),
        };
    }
    return null;
}

// ========================= Composable =========================

/**
 * @param {import('vue').Ref<Array>|import('vue').ComputedRef<Array>} messages
 *        — 消息列表（来自 sessionStore.messages）
 * @returns {{ currentOutput: import('vue').ComputedRef<Object|null>,
 *             allOutputs: import('vue').ComputedRef<Array>,
 *             outputType: import('vue').ComputedRef<string> }}
 */
export function useOutputParser(messages) {
    /**
     * 所有从消息中解析出的结构化产出
     */
    const allOutputs = computed(() => {
        const results = [];
        for (const msg of messages.value) {
            if (msg.role !== 'assistant' || msg.isLoading || msg.isError) continue;
            const text = msg.content || '';

            // 按优先级检测：先找标记，再降级
            const output =
                extractCard(text) ||
                extractFramework(text) ||
                extractReport(text) ||
                extractSql(text) ||
                extractImplicit(text);

            if (output) {
                results.push({
                    ...output,
                    messageId: msg.id,
                    timestamp: msg.timestamp,
                });
            }
        }
        return results;
    });

    /**
     * 当前最新的结构化产出（自动跟随最后一条 assistant 消息）
     */
    const currentOutput = computed(() => {
        const outputs = allOutputs.value;
        return outputs.length > 0 ? outputs[outputs.length - 1] : null;
    });

    /**
     * 当前产出类型（为空时返回 'none'）
     */
    const outputType = computed(() => {
        return currentOutput.value?.type || 'none';
    });

    return {
        currentOutput,
        allOutputs,
        outputType,
    };
}
