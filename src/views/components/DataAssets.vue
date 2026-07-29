<template>
    <div class="h-full flex flex-col overflow-hidden bg-white rounded-xl border shadow-sm">
        <!-- Header -->
        <div class="px-6 pt-6 pb-4 border-b border-slate-100 shrink-0">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Database class="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-slate-800">数据资产</h2>
                    <p class="text-xs text-slate-500">您的数据报告</p>
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
                如需采购数据报告，请联系项目人员开通权限。
            </p>

            <!-- Feature cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg w-full">
                <div class="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div class="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-2.5">
                        <FileText class="w-4.5 h-4.5 text-blue-500" />
                    </div>
                    <span class="text-xs font-medium text-slate-600">数据报告</span>
                    <span class="text-[11px] text-slate-400 mt-1">CSV / Excel 格式</span>
                </div>
                <div class="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-2.5">
                        <Download class="w-4.5 h-4.5 text-green-500" />
                    </div>
                    <span class="text-xs font-medium text-slate-600">一键下载</span>
                    <span class="text-[11px] text-slate-400 mt-1">按天筛选打包</span>
                </div>
                <div class="flex flex-col items-center text-center p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center mb-2.5">
                        <Shield class="w-4.5 h-4.5 text-purple-500" />
                    </div>
                    <span class="text-xs font-medium text-slate-600">权限管控</span>
                    <span class="text-[11px] text-slate-400 mt-1">手机号鉴权</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Database, FolderOpen, FileText, Download, Shield } from 'lucide-vue-next';

    export default {
        name: 'DataAssets',
        components: { Database, FolderOpen, FileText, Download, Shield },
    };
</script>
