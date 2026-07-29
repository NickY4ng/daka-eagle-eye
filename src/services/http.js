/**
 * HTTP 客户端（原型版 — 无鉴权）
 */
import axios from 'axios';

export const JSON_HEADERS = {
    'Content-Type': 'application/json;charset=UTF-8',
};

export const FORM_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
};

export const AUTH_TOKEN_KEY = 'admin_token';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
