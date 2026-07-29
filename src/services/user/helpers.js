export const userHelpers = {
    /**
     * 验证新密码是否符合规则
     * 规则：8～20 位，仅允许字母与数字，且须同时包含字母与数字
     * @param {string} plain - 明文密码
     * @returns {string|null} 不符合规则时返回错误文案，符合则返回 null
     */
    validateNewPasswordPolicy(plain) {
        const s = plain;
        if (s.length < 8 || s.length > 20) {
            return '密码长度需为 8～20 位';
        }
        if (!/^[a-zA-Z0-9]+$/.test(s)) {
            return '密码仅可使用字母与数字';
        }
        if (!/[a-zA-Z]/.test(s) || !/\d/.test(s)) {
            return '密码须同时包含字母与数字';
        }
        return null;
    },
    /**
     * 从登录响应中提取 token
     * @param {Object} data - 登录响应数据
     * @returns {string} token 字符串，未找到则返回空字符串
     */
    extractLoginToken(data) {
        if (!data || typeof data !== 'object') return '';

        if (data.code === 0 && typeof data.data === 'string' && data.data) {
            return data.data;
        }

        const nested = data.body ?? data.data;
        if (typeof nested === 'string' && nested && !data.code) {
            return nested;
        }

        const body = nested ?? data;
        if (!body || typeof body !== 'object') return '';

        const candidates = [
            body.token,
            body.accessToken,
            body.access_token,
            body.authToken,
        ];

        for (const c of candidates) {
            if (typeof c === 'string' && c) return c;
        }

        return '';
    },
    /**
     * 从登录响应中提取显示名称（用户名/手机号）
     * @param {Object} data - 登录响应数据
     * @param {string} fallbackPhone - 回退使用的手机号
     * @returns {string} 显示名称
     */
    extractLoginDisplayName(data, fallbackPhone) {
        if (!data || typeof data !== 'object') return fallbackPhone;

        if (data.code === 0 && typeof data.data === 'string') {
            return fallbackPhone;
        }

        const rawBody = data.body ?? data.data;
        if (typeof rawBody === 'string') return fallbackPhone;

        const body = rawBody;
        if (!body || typeof body !== 'object') return fallbackPhone;

        const u = body.user ?? body.userInfo;
        if (u && typeof u === 'object') {
            const name = u.userName ?? u.username ?? u.name ?? u.phone ?? u.mobile;
            if (typeof name === 'string' && name.trim()) return name.trim();
        }

        const phone = body.phone ?? body.mobile ?? body.phoneNumber;
        if (typeof phone === 'string' && phone.trim()) return phone.trim();

        return fallbackPhone;
    },
    /**
     * 从登录响应中提取用户 ID
     * @param {Object} data - 登录响应数据
     * @returns {string} 用户 ID 字符串，未找到则返回空字符串
     */
    extractUserId(data) {
        if (!data || typeof data !== 'object') return '';

        if (data.code === 0 && typeof data.data === 'string') return '';

        const body = data.body ?? data.data;
        if (!body || typeof body !== 'object') return '';

        const u = body.user ?? body.userInfo;
        if (u && typeof u === 'object') {
            const id = u.id ?? u.userId ?? u.user_id;
            if (id !== undefined && id !== null) return String(id);
        }

        const id = body.userId ?? body.user_id ?? body.id;
        if (id !== undefined && id !== null) return String(id);

        return '';
    },
};
