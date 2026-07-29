import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state() {
        return {
            showLeft: true,
            showSessions: true,
        };
    },
    persist: {
        storage: sessionStorage,
    },
    getters: {},
    actions: {
        clearAll() {
            this.showLeft = true;
            this.showSessions = true;
        },
    },
});
