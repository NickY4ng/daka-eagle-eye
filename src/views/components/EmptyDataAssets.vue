<template>
    <div class="h-full flex flex-col overflow-hidden bg-white rounded-xl border shadow-sm">
        <!-- Header -->
        <div class="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Database class="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-slate-800">数据资产（空）</h2>
                    <p class="text-xs text-slate-500">无数据时的展示效果</p>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div class="flex-1 flex flex-col items-center justify-center px-8 py-12">
            <!-- Illustration Area -->
            <div class="relative mb-8">
                <!-- Outer glow ring -->
                <div class="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-blue-100/60 blur-2xl"></div>
                <!-- Icon container -->
                <div class="relative w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shadow-sm">
                    <FolderOpen class="w-12 h-12 text-slate-300" />
                </div>
                <!-- Decorative dots -->
                <div class="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-blue-100 border-2 border-white shadow-sm"></div>
                <div class="absolute -bottom-1 -left-2 w-3.5 h-3.5 rounded-full bg-cyan-100 border-2 border-white shadow-sm"></div>
                <div class="absolute top-1/2 -right-4 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
            </div>

            <!-- Text -->
            <h3 class="text-lg font-semibold text-slate-700 mb-2">暂无数据报告</h3>
            <p class="text-sm text-slate-500 text-center max-w-sm leading-relaxed mb-8">
                您当前没有可用的数据报告。<br />
                如需采购数据报告，请联系客户经理。
            </p>

        </div>
    </div>
</template>

<script>
    import { Database, FolderOpen } from 'lucide-vue-next';

    export default {
        name: 'EmptyDataAssets',
        components: { Database, FolderOpen },
    };
</script>
