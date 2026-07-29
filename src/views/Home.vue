<template>
    <div class="flex h-screen flex-row bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
        <Header :activeModule="activeModule" @module-change="changeModule" @create-session="toCreateSession(null)">
            <ChatSideBar v-if="activeModule==='query'" @confirm-delete="toDelete" @select="toSelectSession"/>
        </Header>
        <main class="min-h-0 flex-1 overflow-hidden p-4">
            <div v-if="activeModule === 'query'" class="h-full w-full">
                <SmartQueryAgent ref="smartQueryAgentRef"/>
            </div>
            <div v-if="activeModule === 'data-assets'" class="h-full w-full overflow-hidden">
                <DataAssets/>
            </div>
            <div v-if="activeModule === 'skills'" class="h-full w-full">
                <Skills @select-template="toCreateSession"/>
            </div>
            <div v-if="activeModule === 'automation'" class="h-full w-full">
                <Automation/>
            </div>
        </main>
    </div>
</template>

<script>
    import Header from '@/views/components/Header.vue';
    import SmartQueryAgent from '@/views/components/SmartQueryAgent.vue';
    import DataAssets from '@/views/components/DataAssets.vue';
    import ChatSideBar from '@/components/chat/ChatSidebar.vue';
    import Automation from '@/views/components/Automation.vue';
    import Skills from '@/views/components/Skills.vue';

    export default {
        components: {Skills, Automation, ChatSideBar, Header, SmartQueryAgent, DataAssets},
        data() {
            return {
                activeModule: 'query',
            };
        },
        methods: {
            toDelete(sessionId) {
                this.$refs.smartQueryAgentRef?.deleteSession(sessionId);
            },
            toSelectSession(sessionId) {
                this.$refs.smartQueryAgentRef?.selectSession(sessionId);
            },
            toCreateSession(template) {
                this.activeModule = 'query';
                const fn = () => {
                    if (window.qsm) {
                        this.$refs.smartQueryAgentRef.createSession(template);
                    } else {
                        setTimeout(() => { fn(); }, 50);
                    }
                };
                fn();
            },
            changeModule(module) {
                this.activeModule = module;
            },
        },
    };
</script>
