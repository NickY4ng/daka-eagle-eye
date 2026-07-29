import {getStoredAuthToken, JSON_HEADERS, http, FORM_HEADERS} from '@/services/http.js';


// 默认导出 API 对象
export const SmartQueryAgentApi = {
    /**
     * 构建聊天会话 SSE 连接 URL
     * @param {string} sessionId - 会话 ID
     * @returns {string} SSE 连接 URL，如果未登录则返回空字符串
     */
    buildChatSessionSseUrl(sessionId) {
        const token = getStoredAuthToken();
        if (!token) return '';
        return `${import.meta.env.VITE_API_BASE_URL}/eagleeye-gateway/chat/session/new?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sessionId)}`;
    },
    /**
     * 发送会话消息（服务端通过 SSE 推送结果）
     * @param {Object} params - 请求参数
     * @param {string} params.content - 消息内容
     * @param {string} params.sessionId - 会话 ID
     * @param {string} [params.tType] - 模板类型
     * @param {Array} [params.attachments] - 附件列表
     * @returns {Promise<Object>} 服务端响应
     */
    async createMessageSession(params) {
        let {data} = await http.post(
            '/eagleeye-gateway/chat/message/send',
            params,
            {headers: JSON_HEADERS}
        );
        return data;
    },
    /**
     * 获取报告预览
     * @param params 参数
     * @param {string} params.url - 地址
     * @returns {Promise<Object>} 报告
     */
    async reviewReport(params) {
        let {data} = await http.post('/eagleeye-gateway/chat/report/review', params, {headers: FORM_HEADERS});
        return data;
    },
    /**
     * 获取用户会话列表
     * @param {Object} params - 分页参数
     * @param {number} params.pageNum - 页码
     * @param {number} params.pageSize - 每页数量
     * @returns {Promise<Array>} 会话列表
     */
    async getUserSessions(params) {
        let {data} = await http.post('/eagleeye-gateway/chat/user/sessions', {
            pageNum: params.pageNum,
            pageSize: params.pageSize,
        }, {headers: FORM_HEADERS});
        return data;
    },
    /**
     * 获取会话详情（分页）
     * @param {Object} params - 请求参数
     * @param {string} params.sessionId - 会话 ID
     * @param {number} params.pageNum - 页码
     * @param {number} params.pageSize - 每页数量
     * @returns {Promise<Object>} 会话详情
     */
    async getSessionDetails(params) {
        let {data} = await http.post('/eagleeye-gateway/chat/session/details', params, {headers: FORM_HEADERS});
        return data;
    },
    /**
     * 删除用户会话
     * @param {Object} params - 请求参数
     * @param {string} params.sessionId - 会话 ID
     * @returns {Promise<Object>} 删除结果
     */
    async deleteUserSession(params) {
        let {data} = await http.post('/eagleeye-gateway/chat/session/delete', params, {headers: FORM_HEADERS});
        return data;
    },
    /**
     * 上传聊天文件
     * @param {Object} params - 上传参数
     * @param {File} params.file - 文件对象
     * @returns {Promise<Object>} 上传结果，包含文件 URL
     */
    uploadChatFile(params) {
        const formData = new FormData();
        formData.append('file', params.file);
        return http.post('/eagleeye-gateway/chat/file/upload', formData);
    },
    /**
     * 下载文件记录日志
     * @param {Object} params - 请求参数
     * @param {string} params.fileName - 文件名
     * @param {string} params.fileUrl - 文件 URL
     * @param {string} params.templateName - 模板名
     * @returns {Promise<Object>} 下载结果
     * */
    async markDownload(params){
        let {data} = await http.post('/eagleeye-gateway/tb/down/add', params);
        return data;
    },
    /**
     *
     * @param {Object} params - 请求参数
     * @param {string} params.userId - 用户 ID
     * @param {string} params.sessionId - 会话id
     * @param {string} params.templateCode - 模板代码
     * @returns {Promise<Object>} 保存结果
     * */
    async saveDynamicGuide(params){
        let {data} = await http.get('/eagleeye-gateway/user/template/saveDynamicguide',{params});
        return data;
    }
};
