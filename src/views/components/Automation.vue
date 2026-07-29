<template>
    <div class="h-full flex flex-col items-center justify-center bg-white rounded-xl border shadow-sm">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
            <Bot class="w-10 h-10 text-blue-600"/>
        </div>
        <h2 class="text-xl font-semibold text-slate-800 mb-3">自动化</h2>
        <p class="text-sm text-slate-500 mb-8 text-center max-w-md">定时汇总报表、自动化任务执行、周期性数据分析等智能自动化功能</p>
        <div class="px-6 py-3 bg-slate-100 rounded-xl">
            <span class="text-sm text-slate-400">敬请期待</span>
        </div>
    </div>
</template>

<script>
    import {Bot} from 'lucide-vue-next';

    export default {
        name: 'Automation',
        components: {Bot},
    };
</script>
