<template>
    <div v-if="sessionStore.sessions.length > 0" v-show="userStore.showSessions" class="w-64 flex flex-col bg-white border shadow-sm overflow-hidden">
        <div class="px-3 py-2 border-b border-slate-100">
            <span class="text-xs font-medium text-slate-500">历史会话</span>
        </div>
        <div class="flex-1 overflow-auto p-2 space-y-1">
            <div v-for="session in sessionStore.sessions" :key="session.id" :class="['group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all', sessionStore.activeSessionId === session.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50']" @click="$emit('select', session.id)">
                <FileText class="w-4 h-4 shrink-0"/>
                <div class="flex-1 min-w-0 overflow-hidden">
                    <div class="text-sm truncate" :title="session.name">{{ session.name }}</div>
                </div>
                <Button variant="ghost" size="icon" class="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 hover:bg-red-500/80" @click.stop="$emit('confirmDelete', session.id)">
                    <Trash2 class="w-3.5 h-3.5 text-slate-400 group-hover:text-white"/>
                </Button>
            </div>
        </div>
    </div>
</template>
<script>
    import {Button} from '@/components/ui/button';
    import {Trash2, FileText} from 'lucide-vue-next';
    import {useSessionStore} from '@/store/session.js';
    import {useUserStore} from '@/store/user.js';

    export default {
        name: 'ChatSideBar',
        setup() {
            return {
                sessionStore: useSessionStore(),
                userStore: useUserStore(),
            };
        },
        components: {Button, Trash2, FileText},
        emits: ['select', 'confirmDelete'],
    };
</script>
