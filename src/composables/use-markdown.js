/**
 * Created by jack on 2026/5/22
 */
import MarkdownIt from 'markdown-it';

/**
 * 创建 MarkdownIt 实例（带自定义配置）
 */
export const useMarkdown = ()=> {
    let md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
    });


    /**
     * 渲染助手消息的 Markdown 内容
     * @param {string} raw - 原始文本
     * @returns {string} 渲染后的 HTML
     */
    function renderAssistantMarkdown(raw) {
        if (!raw) return '';

        let text = raw.replace(/\r\n/g, '\n');
        text = text.replace(/^(\s{0,3})(#{1,6})([^\s#])/gm, '$1$2 $3');

        return md.render(text);
    }

    /**
     * 解析过程片段（用于 SSE 流式输出的步骤解析）
     * @param {string} raw - 原始文本
     * @returns {{title: string, meta?: string, bodyMd: string} | null} 解析结果
     */
    function parseProcessFragment(raw) {
        const text = raw.replace(/\r\n/g, '\n').trim();
        if (!text) return null;

        const lines = text.split('\n');
        const first = lines[0];
        const headingMatch = first.match(/^\s{0,3}(#{1,6})\s*(.*)$/);

        let titleLine, restLines;
        if (headingMatch && headingMatch[2] !== undefined) {
            titleLine = headingMatch[2].trim();
            restLines = lines.slice(1);
        } else {
            titleLine = first.trim();
            restLines = lines.slice(1);
        }

        let meta;
        const pipeIdx = titleLine.indexOf('|');
        if (pipeIdx !== -1) {
            meta = titleLine.slice(pipeIdx + 1).trim();
            titleLine = titleLine.slice(0, pipeIdx).trim();
        }

        return {
            title: titleLine || '步骤',
            meta,
            bodyMd: restLines.join('\n').trim(),
        };
    }

    return {
        renderAssistantMarkdown,
        parseProcessFragment,
    };
};
