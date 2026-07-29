<template>
    <div class="h-full flex rounded-xl border shadow-sm overflow-hidden bg-white">
        <div class="w-56 border-r border-slate-100 bg-slate-50/50">
            <div class="px-6 py-5 border-b border-slate-100">
                <div class="text-base font-semibold text-slate-800">技能</div>
            </div>
            <div class="py-3">
                <button v-for="(group, index) in groupTemplates" :key="index" type="button" class="w-full px-6 py-2.5 text-left text-sm transition-all duration-200 border-l-4" :class="activeGroupIndex === index ? 'bg-blue-50 border-blue-600 text-blue-600 font-medium -ml-[1px]' : 'border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-300'" @click="activeGroupIndex = index"> {{ group.name }}</button>
            </div>
        </div>

        <div class="flex-1 flex flex-col">
            <div class="px-6 pt-6 pb-4 border-b border-slate-100">
                <div class="text-lg font-semibold text-slate-900">
                    {{ typeList[activeGroupIndex].desc }}
                </div>
                <div v-if="activeGroupIndex===1" class="mt-4 bg-[#FFF3CD] border border-[#FFE69C] rounded px-4 py-3 flex items-start gap-2">
                    <span class="text-[#856404] text-sm">ℹ️</span>
                    <p class="text-sm text-[#856404]">提示：单次下载最大支持 1GB 文件，超出限制请缩小时间范围或筛选条件</p>
                </div>
            </div>

            <div class="flex-1 overflow-auto px-6 pb-6 pt-4">
                <div v-if="loading" class="flex items-center justify-center py-16">
                    <Loader2 class="w-6 h-6 animate-spin text-blue-500"/>
                    <span class="ml-2 text-sm text-slate-500">加载模板中...</span>
                </div>
                <div v-else class="grid grid-cols-2 gap-4">
                    <div v-for="t in groupTemplates[activeGroupIndex]?.templates" :key="t.id" class="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-blue-400 hover:shadow-md cursor-pointer" :class="t.disabled ? 'opacity-50 cursor-not-allowed' : ''" @click="!t.disabled && openDetail(t)">
                        <div class="flex items-start gap-4">
                            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm" :class="t.iconGradientClass">
                                <component :is="t.icon" class="h-6 w-6"/>
                            </div>
                            <div class="min-w-0 flex-1 pt-1">
                                <div class="text-base font-medium text-slate-800 group-hover:text-blue-900">{{ t.title }}</div>
                                <p class="mt-1 text-xs text-slate-400 truncate">{{ getSummary(t) }}</p>
                                <p v-if="t.disabled" class="mt-2 text-xs text-red-400 leading-relaxed">暂无权限，请联系管理员开通<br> <span style="color:#666">如需使用此模板，请确认已采购相关数据权限</span></p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                            <Button variant="outline" size="sm" class="flex-1" @click.stop="openDetail(t)">详情</Button>
                            <Button :disabled="t.disabled" size="sm" class="flex-1" @click.stop="toSelect(t)">去使用</Button>
                        </div>
                    </div>

                    <div v-if="groupTemplates[activeGroupIndex]?.templates.length === 0" class="col-span-2 flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                        <FileText class="w-12 h-12 text-slate-300 mb-3"/>
                        <div class="text-sm font-medium text-slate-500 mb-1">暂无{{ groupTemplates[activeGroupIndex]?.name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Dialog :open="detailOpen" @update:open="detailOpen = $event">
        <DialogContent :show-close="true" class="max-w-[600px] max-h-[70vh] flex flex-col sm:rounded-xl">
            <DialogHeader>
                <DialogTitle>{{ detailTemplate?.title }}</DialogTitle>
            </DialogHeader>
            <div class="overflow-y-auto flex-1 -mx-6 px-6">
                <div class="space-y-3 pb-2">
                    <div>
                        <div class="mb-1.5 font-semibold text-slate-900">分析目的</div>
                        <p class="leading-relaxed text-slate-600">{{ detailTemplate?.title }}</p>
                    </div>
                    <div v-if="detailTemplate?.content">
                        <div class="mb-2 font-semibold text-slate-900">分析维度</div>
                        <div v-html="markdown.renderAssistantMarkdown(detailTemplate.content)"></div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script>
    import {FileText, MapPin, Loader2} from 'lucide-vue-next';
    import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
    import {Button} from '@/components/ui/button';
    import {template} from "@/services/template.js";
    import {useMarkdown} from "@/composables/use-markdown.js";

    export default {
        name: 'Skills',
        setup() {
            return {
                markdown: useMarkdown()
            };
        },
        components: {FileText, Loader2, Dialog, DialogContent, DialogHeader, DialogTitle, Button},
        data() {
            return {
                loading: false,
                templates: [],
                activeGroupIndex: 0,
                detailOpen: false,
                detailTemplate: null,
                typeList: [
                    {code: '1', name: 'AI分析技能', desc: "请选择技能"},
                    {code: '2', name: '数据下载技能', desc: "请选择技能"},
                    {code: '3', name: '其他技能', desc: "请选择技能"}
                ],
            };
        },
        computed: {
            groupTemplates() {
                return this.typeList.map(o => {
                    o.templates = this.templates.filter(t => `${t.type}` === o.code);
                    return o;
                }).filter(o => o.templates.length > 0);
            }
        },
        emits: ['select-template'],
        mounted() {
            this.queryList();
        },
        methods: {
            queryList() {
                this.loading = true;
                template.query().then(res => {
                    const rData = res.data;
                    if (rData && rData.data) {
                        const list = [];
                        rData.data.forEach((item) => {
                            list.push({
                                ...item,
                                name: item.title,
                                code: item.tbCode,
                                icon: MapPin,
                                iconGradientClass: 'from-violet-500 to-purple-600',
                                disabled: item.access !== 1,
                            });
                        });
                        list.sort((a, b) => b.access - a.access);
                        this.templates = list;
                    }
                }).catch(e => {
                    console.log(e);
                }).finally(() => {
                    this.loading = false;
                });
            },
            getSummary(t) {
                const title = (t.title || '').trim();
                const summaryMap = {
                    '同区域货物流向分析': '分析同区域内各货类货物的流量与流向分布',
                    '跨区域货物流向分析': '分析跨区域各货类货物的流量与流向分布',
                    '工程车与道路货运车关键指标对比分析': '对比两类车辆的活跃度与运营效率差异',
                    '燃油类型分布分析': '统计区域车辆燃油类型构成与占比分布',
                    '企业车辆分布分析': '统计各企业名下车辆保有量构成与占比',
                    '排放标准分布分析': '统计区域车辆排放标准构成与占比分布',
                    '吨位区间分布分析': '统计区域车辆吨位区间构成与占比分布',
                    '城市通行频次分析': '统计车辆跨城市通行频次排行与分布',
                    '车龄分布分析': '统计区域车辆车龄区间构成与占比分布',
                    '车辆品牌分布分析': '统计各品牌车辆数量及类型交叉分布',
                    '车辆类型分布分析': '统计各类车型区域分布构成与占比',
                    '月度行驶里程分析': '统计车辆月度平均行驶里程区间分布',
                    '月度运营天数分析': '统计车辆月度平均运营天数区间分布',
                    '省份通行频次分析': '统计车辆跨省份通行频次排行与分布',
                    '常跑线路TOP分析': '统计车辆常跑线路排名与流量分布',
                };
                if (summaryMap[title]) return summaryMap[title];

                if (title.includes('保有量统计')) return '按区域与月份统计车辆保有量明细并导出';
                if (title.includes('新增车辆统计')) return '按区域与日期统计新增入网车辆并导出';
                if (title.includes('迁出统计')) return '按区域与日期统计车辆迁出明细并导出';
                if (title.includes('运单明细')) return '按起终点和货类筛选运单明细并导出';
                if (title.includes('企业名称解密') || title.includes('名称解密') || title.includes('目标企业识别')) return '将加密企业名称还原为真实企业名称';

                return title;
            },
            openDetail(t) {
                this.detailTemplate = t;
                this.detailOpen = true;
            },
            toSelect(t) {
                this.$emit('select-template', t);
            },
        },
    };
</script>
