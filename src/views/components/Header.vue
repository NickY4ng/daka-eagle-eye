<template>
    <aside v-show="userStore.showLeft" class="w-64 h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
        <!-- Logo -->
        <div class="p-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain class="w-6 h-6 text-white"/>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-slate-800">数据决策平台</h1>
                </div>
            </div>
        </div>

        <!-- New Session Button -->
        <div class="p-3">
            <Button class="w-full gap-2 text-white border-0 bg-blue-600 hover:bg-blue-700 shadow-md" size="sm" @click="$emit('create-session')">
                <span class="text-lg">+</span> 开启新会话
            </Button>
        </div>

        <nav class="px-2 pb-2 space-y-1">
            <Button v-for="module in modules" :key="module.id" variant="ghost" size="sm" :class="classList(module)" @click="$emit('module-change', module.id)">
                <component :is="module.icon" :class="['w-4 h-4', activeModule === module.id ? 'text-blue-600' : '']"/>
                <span>{{ module.name }}</span>
            </Button>
        </nav>

        <!-- Sessions slot (ChatSidebar) -->
        <div class="flex-1 min-h-0 overflow-hidden flex flex-col">
            <slot/>
        </div>
    </aside>
</template>

<script>
    import {Brain, Zap, Bot, Database} from 'lucide-vue-next';
    import {Button} from '@/components/ui/button';
    import {cn} from '@/lib/utils';
    import {useUserStore} from '@/store/user.js';

    export default {
        name: 'Header',
        setup() {
            return { userStore: useUserStore() };
        },
        components: {Button, Brain, Zap, Bot, Database},
        props: {
            activeModule: { type: String, required: true },
        },
        emits: ['module-change', 'create-session'],
        data() {
            return {
                modules: [
                    {id: 'query', name: '智能报表', icon: Brain},
                    {id: 'skills', name: '技能', icon: Zap},
                    {id: 'data-assets', name: '数据资产', icon: Database},
                    {id: 'empty-data', name: '数据资产（空样式）', icon: Database},
                    {id: 'automation', name: '自动化', icon: Bot},
                ],
            };
        },
        methods: {
            classList(module) {
                const r = this.activeModule === module.id
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600';
                return cn('w-full justify-start gap-3 rounded-lg px-3 py-2.5 transition-all', r);
            },
        },
    };
</script>
