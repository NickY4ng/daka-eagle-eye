<template>
    <div class="h-full flex flex-col overflow-hidden bg-white rounded-xl border shadow-sm">
        <!-- ===== 主视图：需求列表 ===== -->
        <template v-if="currentView === 'list'">
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

            <div class="flex-1 overflow-auto px-6 py-4">
                <div v-if="requirements.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
                    <FolderOpen class="w-16 h-16 mb-4 text-slate-200" />
                    <p class="text-sm">暂无数据报告</p>
                    <p class="text-xs mt-1">如需采购数据报告，请联系项目人员</p>
                </div>

                <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <Card
                        v-for="req in requirements"
                        :key="req.id"
                        class="group cursor-pointer border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                        @click="openRequirement(req)"
                    >
                        <CardContent class="p-4">
                            <div class="flex items-start gap-3">
                                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                    <FileText class="w-5 h-5 text-blue-600" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3 class="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                                        {{ req.name }}
                                    </h3>
                                    <div class="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                        <span class="flex items-center gap-1">
                                            <FileText class="w-3.5 h-3.5" />
                                            {{ req.totalFiles }} 个文件
                                        </span>
                                        <span class="flex items-center gap-1">
                                            <Calendar class="w-3.5 h-3.5" />
                                            最新 {{ req.latestDate }}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight class="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0 mt-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </template>

        <!-- ===== 详情视图：按天分组的文件列表 ===== -->
        <template v-else>
            <!-- 顶部标题栏 -->
            <div class="px-6 pt-4 pb-3 border-b border-slate-100 shrink-0">
                <button
                    class="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-3"
                    @click="currentView = 'list'"
                >
                    <ArrowLeft class="w-4 h-4" />
                    返回需求列表
                </button>
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText class="w-5 h-5 text-blue-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <h2 class="text-base font-semibold text-slate-800 truncate">{{ selectedReq?.name }}</h2>
                        <p class="text-xs text-slate-500">共 {{ selectedReq?.totalFiles }} 个文件</p>
                    </div>
                </div>
            </div>

            <!-- 文件列表 -->
            <div class="flex-1 overflow-auto px-6 py-4 space-y-5">
                <div v-for="group in dateGroups" :key="group.date" class="rounded-xl border border-slate-200 overflow-hidden">
                    <!-- 日期头部 -->
                    <div class="flex items-center justify-between px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                        <div class="flex items-center gap-2">
                            <Calendar class="w-4 h-4 text-slate-500" />
                            <span class="text-sm font-semibold text-slate-700">{{ group.date }}</span>
                        </div>
                        <Button variant="outline" size="sm" class="gap-1.5" @click="downloadDay(group)">
                            <Download class="w-3.5 h-3.5" />
                            下载全部
                        </Button>
                    </div>

                    <!-- 文件行 -->
                    <div class="divide-y divide-slate-50">
                        <div
                            v-for="(file, idx) in group.files"
                            :key="idx"
                            class="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
                        >
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <FileText class="w-4 h-4 text-slate-400 shrink-0" />
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-slate-700 truncate font-mono text-xs">{{ file.name }}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" class="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0 ml-4" @click="downloadFile(file)">
                                <Download class="w-3.5 h-3.5" />
                                下载
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import { Database, FolderOpen, FileText, Calendar, ChevronRight, Download, ArrowLeft } from 'lucide-vue-next';
    import { Card, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';

    // Mock 数据报告
    const MOCK_REQUIREMENTS = [
        {
            id: 1,
            name: '黄埔区货运车辆数据分析需求2.3',
            latestDate: '2026-07-14',
            filesByDate: {
                '2026-07-14': [
                    { name: '黄埔区货运车辆数据分析需求2.3_20260714_task-37786_file518336.csv', rows: 12580 },
                    { name: '黄埔区货运车辆数据分析需求2.3_20260714_task-37786_file518337.csv', rows: 8490 },
                ],
                '2026-07-13': [
                    { name: '黄埔区货运车辆数据分析需求2.3_20260713_task-37785_file518335.csv', rows: 11200 },
                ],
                '2026-07-12': [
                    { name: '黄埔区货运车辆数据分析需求2.3_20260712_task-37780_file518330.csv', rows: 10950 },
                ],
            },
        },
        {
            id: 2,
            name: '左海供应链多车轨迹查询',
            latestDate: '2026-07-14',
            filesByDate: {
                '2026-07-14': [
                    { name: '左海供应链多车轨迹查询1.0_20260714_task-38503_file52001.csv', rows: 8320 },
                    { name: '左海供应链多车轨迹查询1.0_20260714_task-38503_file52002.csv', rows: 156400 },
                    { name: '左海供应链多车轨迹查询1.0_20260714_task-38503_file52003.csv', rows: 892100 },
                ],
            },
        },
        {
            id: 3,
            name: '全国车辆入网日报',
            latestDate: '2026-07-14',
            filesByDate: {
                '2026-07-14': [
                    { name: '全国车辆入网日报2.1_20260714_task-39001_file52100.csv', rows: 45200 },
                    { name: '全国车辆入网日报2.1_20260714_task-39001_file52101.csv', rows: 12800 },
                ],
                '2026-07-13': [
                    { name: '全国车辆入网日报2.1_20260713_task-38990_file52080.csv', rows: 44900 },
                ],
                '2026-07-12': [
                    { name: '全国车辆入网日报2.1_20260712_task-38980_file52060.csv', rows: 44500 },
                ],
                '2026-07-11': [
                    { name: '全国车辆入网日报2.1_20260711_task-38970_file52040.csv', rows: 44100 },
                ],
            },
        },
        {
            id: 4,
            name: '华南区域运单汇总需求1.1',
            latestDate: '2026-07-13',
            filesByDate: {
                '2026-07-13': [
                    { name: '华南区域运单汇总需求1.1_20260713_task-39100_file52150.csv', rows: 67800 },
                    { name: '华南区域运单汇总需求1.1_20260713_task-39100_file52151.csv', rows: 23100 },
                ],
            },
        },
        {
            id: 5,
            name: '成都区域运力统计周报',
            latestDate: '2026-07-10',
            filesByDate: {
                '2026-07-10': [
                    { name: '成都区域运力统计周报3.0_20260710_task-39200_file52200.csv', rows: 18500 },
                ],
                '2026-07-03': [
                    { name: '成都区域运力统计周报3.0_20260703_task-39180_file52180.csv', rows: 17900 },
                ],
            },
        },
    ];

    export default {
        name: 'DataAssets',
        components: { Database, FolderOpen, FileText, Calendar, ChevronRight, Download, ArrowLeft, Card, CardContent, Button },
        data() {
            return {
                currentView: 'list',
                selectedReq: null,
                requirements: [],
            };
        },
        computed: {
            dateGroups() {
                if (!this.selectedReq || !this.selectedReq.filesByDate) return [];
                const dates = Object.keys(this.selectedReq.filesByDate).sort((a, b) => b.localeCompare(a));
                return dates.map(date => ({
                    date,
                    files: this.selectedReq.filesByDate[date],
                }));
            },
        },
        created() {
            // 初始化 mock 数据，补全计算字段
            this.requirements = MOCK_REQUIREMENTS.map(req => {
                let totalFiles = 0;
                const dates = Object.keys(req.filesByDate);
                dates.forEach(d => { totalFiles += req.filesByDate[d].length; });
                return {
                    ...req,
                    totalFiles,
                    dateCount: dates.length,
                };
            });
        },
        methods: {
            openRequirement(req) {
                this.selectedReq = req;
                this.currentView = 'detail';
            },
            downloadFile(file) {
                // TODO: 对接后端下载接口
                console.log('下载单文件:', file.name);
            },
            downloadDay(group) {
                // TODO: 对接后端打包下载接口
                console.log('下载当天全部文件:', group.date, group.files.map(f => f.name));
            },
        },
    };
</script>
