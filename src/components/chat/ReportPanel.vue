<template>
    <div class="flex shrink-0 rounded-xl border shadow-sm overflow-hidden bg-white" :style="{ width: `${rightPanelWidthPx}px` }">
        <div class="w-1.5 shrink-0 cursor-ew-resize hover:bg-blue-400/40 active:bg-blue-500/50 border-r border-slate-100 flex items-stretch justify-center group touch-none" title="拖拽调整预览区宽度" @pointerdown="onRightPanelResizePointerDown">
            <span class="w-px h-8 self-center rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors"/>
        </div>
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div class="px-4 py-3 border-b flex items-center justify-between">
                <div class="flex items-center gap-3 text-sm font-medium text-slate-800">
                    <Eye class="w-4 h-4 text-slate-600"/>
                    <span>预览</span>
                </div>
                <div class="flex items-center gap-1">
                    <Button variant="ghost" size="icon" class="h-7 w-7" @click="handleDownloadReport">
                        <Download class="w-3.5 h-3.5"/>
                    </Button>
                    <Button variant="ghost" size="icon" class="h-7 w-7" @click="$emit('hide-panel')">
                        <X class="w-3.5 h-3.5"/>
                    </Button>
                </div>
            </div>

            <div class="flex-1 overflow-hidden">
                <div class="h-full">
                    <iframe ref="previewIframeRef" class="w-full h-full border-0" sandbox="allow-scripts allow-same-origin"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {defineComponent, ref,onUnmounted} from "vue";
    import {Download, Eye, X} from "lucide-vue-next";
    import {Button} from "@/components/ui/button/index.js";
    import {downloadHtmlReport} from "@/lib/utils.js";


    export default defineComponent({
        name: "ReportPanel",
        setup() {
            let rightPanelResizeStartClientX = 0;
            let rightPanelResizeStartWidthPx = 0;
            const rightPanelWidthPx = ref(500);
            const isResizingRightPanel = ref(false);
            const RIGHT_PANEL_MIN_WIDTH_PX = 320;
            const RIGHT_PANEL_MAX_WIDTH_PX = 1200;

            function getRightPanelMaxWidthPx() {
                const reservedForLayout = 280;
                return Math.max(
                    RIGHT_PANEL_MIN_WIDTH_PX,
                    Math.min(RIGHT_PANEL_MAX_WIDTH_PX, window.innerWidth - reservedForLayout),
                );
            }
            //(封装): 拖拽
            function onRightPanelResizePointerMove(event) {
                if (!isResizingRightPanel.value) return;
                const deltaPx = rightPanelResizeStartClientX - event.clientX;
                const nextWidthPx = rightPanelResizeStartWidthPx + deltaPx;
                const maxWidthPx = getRightPanelMaxWidthPx();
                rightPanelWidthPx.value = Math.min(
                    maxWidthPx,
                    Math.max(RIGHT_PANEL_MIN_WIDTH_PX, nextWidthPx),
                );
            }

            //(封装): 拖拽
            function onRightPanelResizePointerUp() {
                if (!isResizingRightPanel.value) return;
                isResizingRightPanel.value = false;
                window.removeEventListener('pointermove', onRightPanelResizePointerMove);
                window.removeEventListener('pointerup', onRightPanelResizePointerUp);
                window.removeEventListener('pointercancel', onRightPanelResizePointerUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }

            function onRightPanelResizePointerDown(event) {
                event.preventDefault();
                rightPanelResizeStartClientX = event.clientX;
                rightPanelResizeStartWidthPx = rightPanelWidthPx.value;
                isResizingRightPanel.value = true;
                event.target.setPointerCapture?.(event.pointerId);
                window.addEventListener('pointermove', onRightPanelResizePointerMove);
                window.addEventListener('pointerup', onRightPanelResizePointerUp);
                window.addEventListener('pointercancel', onRightPanelResizePointerUp);
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
            }

            onUnmounted(()=>{
                onRightPanelResizePointerUp();
            });
            return {
                rightPanelWidthPx,
                onRightPanelResizePointerDown,
            };
        },
        components: {Button, Download, Eye, X},
        data() {
            return {
                lastRenderedPreviewKey:''
            };
        },
        props: {
            task: {
                type: Object,
                default: null
            },
            previewHtml: {
                type: String,
            }
        },
        watch:{
            previewHtml:{
                handler(newValue) {
                    let renderHtml=()=>{
                        if (this.$refs.previewIframeRef) {
                            let iframe = this.$refs.previewIframeRef;
                            const html = newValue;
                            if (!html) return;
                            const renderKey = html;

                            if (this.lastRenderedPreviewKey === renderKey) return;

                            iframe.removeAttribute('src');
                            iframe.srcdoc = html;

                            this.lastRenderedPreviewKey = renderKey;
                        }else{
                            setTimeout(()=>{
                                renderHtml();
                            },30);
                        }
                    };
                    if(newValue) {
                        renderHtml();
                    }else{
                        this.lastRenderedPreviewKey = '';
                    }
                },
                immediate: true
            }
        },
        methods: {
            handleDownloadReport(){
                // if (this.previewTaskId) {
                //     const task = getDeepTaskById(previewTaskId);
                //     if (task?.reportDownloadUrl) {
                //         window.open(task.reportDownloadUrl, '_blank', 'noopener,noreferrer');
                //         return;
                //     }
                // }
                if(this.task && this.task.reportDownloadUrl){
                    window.open(this.task.reportDownloadUrl, '_blank', 'noopener,noreferrer');
                    return;
                }
                // 能走到这一步 说明 previewHtml存在
                if (this.previewHtml) {
                    downloadHtmlReport(this.previewHtml);
                }
            }
        },
        unmounted() {
        }
    });
</script>
