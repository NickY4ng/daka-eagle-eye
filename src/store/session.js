import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

/**
 * 会话 & 消息 Store（纯前端版 — 无后端同步、无 SSE）
 *
 * 所有会话和消息只存在 Pinia 内存中，刷新即清空。
 * DeepSeek API 调用逻辑由 SmartQueryAgent.vue 自行处理。
 */
export const useSessionStore = defineStore('session', () => {
    // ============= State =============
    const sessions = ref([]);
    const activeSessionId = ref(null);
    const loadingSessionIds = ref(new Set());
    const pendingAssistantMessageIdBySession = ref({});

    // ============= Getters =============
    const activeSession = computed(() => {
        return sessions.value.find((s) => s.id === activeSessionId.value) || null;
    });

    const messages = computed(() => {
        return activeSession.value?.messages || [];
    });

    const activeSessionIsLoading = computed(() => {
        const id = activeSessionId.value;
        return id ? loadingSessionIds.value.has(id) : false;
    });

    // ============= Helpers =============
    function createUuid() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
    }

    function getSessionById(sessionId) {
        if (sessionId) {
            return sessions.value.find((s) => s.id === sessionId) || null;
        }
        return activeSession.value;
    }

    function setSessionLoading(sessionId, loading) {
        if (loading) {
            loadingSessionIds.value.add(sessionId);
        } else {
            loadingSessionIds.value.delete(sessionId);
        }
        loadingSessionIds.value = new Set(loadingSessionIds.value);
    }

    function clearPendingAssistant(sessionId) {
        const next = {...pendingAssistantMessageIdBySession.value};
        delete next[sessionId];
        pendingAssistantMessageIdBySession.value = next;
    }

    function finishPendingSession(sessionId) {
        setSessionLoading(sessionId, false);
        clearPendingAssistant(sessionId);
    }

    // ============= Message Ops =============
    function addMessage(role, content, options = {}, sessionId) {
        const targetSession = getSessionById(sessionId);
        if (!targetSession) return;

        const message = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
            role,
            content,
            timestamp: new Date(),
            ...options,
        };
        targetSession.messages.push(message);
        return message;
    }

    function updateMessage(id, updates, sessionId) {
        const targetSession = getSessionById(sessionId);
        if (!targetSession) return;
        const msg = targetSession.messages.find((m) => m.id === id);
        if (msg) {
            Object.assign(msg, updates);
        }
    }

    function getMessageById(id, sessionId) {
        const targetSession = getSessionById(sessionId);
        if (!targetSession) return null;
        return targetSession.messages.find((m) => m.id === id) || null;
    }

    // ============= Session Ops =============
    function createSession() {
        const newSession = {
            id: createUuid(),
            name: `对话 ${sessions.value.length + 1}`,
            messages: [],
            createdAt: new Date(),
        };
        sessions.value.unshift(newSession);
        activeSessionId.value = newSession.id;
        return newSession;
    }

    function selectSession(id) {
        activeSessionId.value = id;
    }

    function deleteSession(id) {
        loadingSessionIds.value.delete(id);
        sessions.value = sessions.value.filter((s) => s.id !== id);
        if (activeSessionId.value === id) {
            activeSessionId.value = sessions.value[0]?.id || null;
        }
    }

    function resetStore() {
        sessions.value = [];
        activeSessionId.value = null;
        loadingSessionIds.value.clear();
        pendingAssistantMessageIdBySession.value = {};
    }

    return {
        // State
        sessions,
        activeSessionId,
        loadingSessionIds,
        pendingAssistantMessageIdBySession,

        // Getters
        activeSession,
        messages,
        activeSessionIsLoading,

        // Actions
        getSessionById,
        setSessionLoading,
        clearPendingAssistant,
        finishPendingSession,
        addMessage,
        updateMessage,
        getMessageById,
        createSession,
        selectSession,
        deleteSession,
        resetStore,
    };
});
