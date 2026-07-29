import {createRouter, createWebHistory} from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
    ],
});

// 原型模式：无需登录，直接进入首页
router.beforeEach((to) => {
    if (to.name === 'login') {
        // 如果访问登录页，直接跳转到首页
        return {name: 'home'};
    }
    return true;
});

const DEFAULT_TITLE = '大卡鹰眼-物流决策分析智能体';

router.afterEach((to) => {
    document.title = DEFAULT_TITLE;
});
