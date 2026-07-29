import {sha1} from 'js-sha1';
import {AUTH_TOKEN_KEY, FORM_HEADERS, http} from '@/services/http.js';


export const userApi = {
    /**
     * 用户登录
     * @param {Object} params - 登录参数
     * @param {string} params.phone - 手机号
     * @param {string} params.password - 明文密码（会自动 SHA1 加密）
     * @param {string} params.captcha - 验证码
     * @param {string} params.captchaId - 验证码 ID
     * @returns {Promise<Object>} 登录响应，包含 token
     */
    login(params) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        let data={
            phone: String(params.phone).trim(),
            password: sha1(params.password),
            captchaCode: String(params.captcha).trim(),
            captchaUuid: String(params.captchaId).trim(),
        };
        return http.post('/eagleeye-gateway/user/login', data, {headers:FORM_HEADERS});
    },
    /**
     * 忘记密码 / 重置密码
     * @param {Object} params - 重置参数
     * @param {string} params.phone - 手机号
     * @param {string} params.email - 邮箱
     * @returns {Promise<Object>} 重置结果
     */
    resetPassword(params) {
        let data={
            phone: String(params.phone).trim(),
            email: String(params.email).trim(),
        };
        return http.post('/eagleeye-gateway/user/password/reset', data, {headers:FORM_HEADERS});
    },

    /**
     * 修改密码
     * @param {Object} params - 修改参数
     * @param {string} params.originalPassword - 原密码
     * @param {string} params.newPassword - 新密码
     * @param {string} params.confirmPassword - 确认密码
     * @returns {Promise<Object>} 修改结果
     */
    changePassword(params) {
        return http.post('/eagleeye-gateway/user/password/change', {
            originalPassword: sha1(params.originalPassword),
            newPassword: sha1(params.newPassword),
            confirmPassword: sha1(params.confirmPassword),
        }, {headers:FORM_HEADERS});
    },
    getCaptcha() {
        return http.get('/eagleeye-gateway/user/captcha',{responseType:'blob'});
    },
};
