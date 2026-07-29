/**
 * Mock 初始化 — 设置全局 Mock 标志，并在模块加载后覆盖所有 API 方法
 * 必须在 main.js 中最先引入
 */

// 全局 Mock 标志（同步设置，确保所有模块第一时间可见）
window.__MOCK_MODE__ = true;

console.log('[Mock] 🎭 Mock 模式已启用');

// 延迟覆盖 API（等所有模块加载完成后再替换，避免循环依赖）
const patchInterval = setInterval(() => {
    try {
        patchAllApis();
        clearInterval(patchInterval);
        console.log('[Mock] ✅ 所有 API 已替换为 Mock 版本');
    } catch (e) {
    // 模块尚未加载完成，继续等待
    }
}, 50);

// 最多等 5 秒
setTimeout(() => clearInterval(patchInterval), 5000);

async function patchAllApis() {
    const mockData = await import('./data.js');

    // ---- SmartQueryAgentApi ----
    try {
        const { SmartQueryAgentApi } = await import('@/services/SmartQueryAgentApi.js');

        SmartQueryAgentApi.createMessageSession = async () => {
            console.log('[Mock] createMessageSession');
            return mockData.mockMessageSendResponse;
        };

        SmartQueryAgentApi.getUserSessions = async () => {
            console.log('[Mock] getUserSessions');
            return { code: 0, data: mockData.mockSessions };
        };

        SmartQueryAgentApi.getSessionDetails = async (params) => {
            console.log('[Mock] getSessionDetails', params?.sessionId);
            return mockData.getMockSessionDetails(params?.sessionId);
        };

        SmartQueryAgentApi.deleteUserSession = async () => {
            console.log('[Mock] deleteUserSession');
            return { code: 0, message: 'ok' };
        };

        SmartQueryAgentApi.reviewReport = async () => {
            console.log('[Mock] reviewReport');
            return mockData.mockReportHtml;
        };

        SmartQueryAgentApi.uploadChatFile = async () => {
            console.log('[Mock] uploadChatFile');
            return mockData.mockUploadResponse;
        };

        SmartQueryAgentApi.markDownload = async () => {
            console.log('[Mock] markDownload');
            return { code: 0 };
        };

        SmartQueryAgentApi.saveDynamicGuide = async () => {
            console.log('[Mock] saveDynamicGuide');
            return { code: 0 };
        };

        SmartQueryAgentApi.buildChatSessionSseUrl = () => 'mock://sse';
    } catch (e) {
        console.warn('[Mock] SmartQueryAgentApi 替换失败:', e.message);
    }

    // ---- template ----
    try {
        const { template } = await import('@/services/template.js');
        template.query = async () => {
            console.log('[Mock] template.query');
            return { data: mockData.mockTemplateList };
        };
        template.insert = async () => ({ data: { code: 0 } });
        template.update = async () => ({ data: { code: 0 } });
        template.delete = async () => ({ data: { code: 0 } });
    } catch (e) {
        console.warn('[Mock] template 替换失败:', e.message);
    }

    // ---- userApi ----
    try {
        const { userApi } = await import('@/services/user/api.js');
        userApi.login = async () => {
            console.log('[Mock] userApi.login');
            return mockData.mockLoginResponse;
        };
        userApi.getCaptcha = async () => {
            console.log('[Mock] userApi.getCaptcha');
            return {
                headers: { 'x-captcha-uuid': 'mock-captcha-uuid' },
                data: mockData.createMockCaptchaBlob(),
            };
        };
        userApi.resetPassword = async () => {
            console.log('[Mock] userApi.resetPassword');
            return { data: { code: 0, message: 'ok' } };
        };
        userApi.changePassword = async () => {
            console.log('[Mock] userApi.changePassword');
            return { data: { code: 0, message: 'ok' } };
        };
    } catch (e) {
        console.warn('[Mock] userApi 替换失败:', e.message);
    }
}
