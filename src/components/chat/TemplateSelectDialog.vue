<template>
    <Dialog :open="open" @update:open="closeMe">
        <DialogContent :show-close="true" :close-on-overlay-click="false" class="max-w-[900px] w-[min(100%,56rem)] gap-0 p-0 sm:rounded-xl overflow-hidden">
            <div class="flex h-[580px]">
                <div class="w-56 border-r border-slate-100 bg-slate-50/50">
                    <div class="px-6 py-5 border-b border-slate-100">
                        <div class="text-base font-semibold text-slate-800">大卡鹰眼 · 数据工坊</div>
                    </div>
                    <div class="py-3">
                        <button v-for="(group, index) in groupTemplates" :key="index" type="button" class="w-full px-6 py-2.5 text-left text-sm transition-all duration-200 border-l-4" :class="activeGroupIndex === index ? 'bg-blue-50 border-blue-600 text-blue-600 font-medium -ml-[1px]' : 'border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-300'" @click="activeGroupIndex = index"> {{ group.name }}</button>
                    </div>
                </div>

                <div class="flex-1 flex flex-col">
                    <DialogHeader class="px-6 pt-6 pb-4 border-b border-slate-100">
                        <DialogTitle class="text-lg font-semibold text-slate-900">
                            {{ typeList[activeGroupIndex].desc }}
                        </DialogTitle>
                        <div v-if="activeGroupIndex===1" class="mb-4 bg-[#FFF3CD] border border-[#FFE69C] rounded px-4 py-3 flex items-start gap-2">
                            <span class="text-[#856404] text-sm">ℹ️</span>
                            <p class="text-sm text-[#856404]">提示：单次下载最大支持 1GB 文件，超出限制请缩小时间范围或筛选条件</p>
                        </div>
                    </DialogHeader>

                    <div class="flex-1 overflow-auto px-6 pb-6 pt-4">
                        <div class="grid grid-cols-2 gap-4">
                            <HoverCardRoot v-for="t in groupTemplates[activeGroupIndex]?.templates" :key="t.id" :open-delay="120" :close-delay="200">
                                <HoverCardTrigger as-child>
                                    <button type="button" class="group relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:border-blue-400 hover:shadow-md" :class="t.disabled ? 'opacity-50 cursor-not-allowed' : ''" :disabled="t.disabled" @click="!t.disabled && toSelect(t)">
                                        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm" :class="t.iconGradientClass">
                                            <component :is="t.icon" class="h-6 w-6"/>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1">
                                            <div class="text-base font-medium text-slate-800 group-hover:text-blue-900">{{ t.title }}</div>
                                            <p v-if="t.disabled" class="mt-2 text-xs text-red-400 leading-relaxed">暂无权限，请联系管理员开通<br> <span style="color:#666">如需使用此模板，请确认已采购相关数据权限</span></p>
                                        </div>
                                    </button>
                                </HoverCardTrigger>
                                <HoverCardPortal>
                                    <HoverCardContent side="bottom" align="start" :side-offset="10" class="z-[200] max-h-[min(70vh,32rem)] max-w-[min(28rem,calc(100vw-3rem))] w-[min(28rem,calc(100vw-3rem))] overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-4 shadow-xl">
                                        <div class="space-y-3">
                                            <div>
                                                <div class="mb-1.5 font-semibold text-slate-900">分析目的</div>
                                                <p class="leading-relaxed text-slate-600">{{ t.title }}</p>
                                            </div>
                                            <div v-if="t.content">
                                                <div class="mb-2 font-semibold text-slate-900">分析维度</div>
                                                <div v-html="markdown.renderAssistantMarkdown(t.content)"></div>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCardPortal>
                            </HoverCardRoot>

                            <div v-if="groupTemplates[activeGroupIndex]?.templates.length === 0" class="col-span-2 flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <FileText class="w-12 h-12 text-slate-300 mb-3"/>
                                <div class="text-sm font-medium text-slate-500 mb-1">暂无{{ groupTemplates[activeGroupIndex]?.name }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script>
    import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
    import {FileText, MapPin} from 'lucide-vue-next';
    import {HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger} from 'radix-vue';
    import {template} from "@/services/template.js";
    import {promiseCreator} from "@/tools/tools.js";
    import {useMarkdown} from "@/composables/use-markdown.js";

    export default {
        name: 'TemplateSelectDialog',
        setup() {
            return {
                markdown: useMarkdown()
            };
        },
        components: {Dialog, DialogContent, DialogHeader, DialogTitle, FileText, HoverCardRoot, HoverCardTrigger, HoverCardPortal, HoverCardContent},
        data() {
            return {
                open: false,
                uuid: '',
                templates: [],
                activeGroupIndex: 0,
                typeList: [
                    {code: '1', name: 'AI分析模板', desc: "请选择模板，填写条件，开启深度分析"},
                    {code: '2', name: '数据下载', desc: "请选择模板，填写条件，进行数据下载"},
                    {code: '3', name: '其他', desc: "请选择工具，根据提示进行使用"}
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
        mounted() {
        },
        methods: {
            show(args) {
                this.open = true;
                this.uuid = args.uuid;
                this.activeGroupIndex = 0;
                this.queryList();
            },

            queryList() {
                template.query().then(res => {
                    const rData = res.data;
                    if (rData && rData.data) {
                        this.templates = [];
                        let templates=[];
                        rData.data.forEach((item, i) => {
                            templates.push({
                                ...item,
                                name: item.title,
                                code: item.tbCode,
                                icon: MapPin,
                                iconGradientClass: 'from-violet-500 to-purple-600',
                                disabled: item.access !== 1,
                            });
                        });
                        templates.sort((a, b) => {
                            return b.access - a.access;
                        });
                        this.templates = templates;
                    }
                }).catch(e => {
                    console.log(e);
                });
            },
            closeMe() {
                promiseCreator.reject(this.uuid, null);
                this.open = false;
            },

            toSelect(t) {
                promiseCreator.resolve(this.uuid, t);
                this.open = false;
            },
        },
    };
</script>
