<template>
    <div class="h-full flex gap-4">
        <!-- Main Chat Area -->
        <div class="flex-1 min-w-0 flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
            <!-- Chat Header -->
            <div class="px-4 py-3 border-b flex items-center justify-between gap-3 min-w-0">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                    <Button variant="ghost" size="icon" class="h-8 w-8 shrink-0" @click="userStore.showLeft = !userStore.showLeft">
                        <ChevronLeft class="w-4 h-4" v-show="userStore.showLeft"/>
                        <ChevronRight class="w-4 h-4" v-show="!userStore.showLeft"/>
                    </Button>
                    <div class="min-w-0 flex-1">
                        <h2 class="text-sm font-semibold text-slate-800 truncate" :title="activeSession?.name || '智能查询'">{{ activeSession?.name || '智能查询' }}</h2>
                    </div>
                </div>
            </div>

            <!-- Messages Area -->
            <div ref="messagesContainerRef" class="flex-1 overflow-auto p-4 space-y-4">
                <!-- Empty State -->
                <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center overflow-auto py-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shrink-0">
                        <Brain class="w-8 h-8 text-white"/>
                    </div>
                    <p class="text-slate-500 text-sm mb-2">大卡鹰眼 · 物流决策分析智能体</p>
                    <p class="text-xs text-slate-400 mb-6">数据报告下载演示</p>
                    <div class="grid grid-cols-3 gap-3 max-w-2xl w-full px-4">
                        <button
                            v-for="d in demoConversations"
                            :key="d.id"
                            class="text-left text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg px-3 py-2.5 transition-colors border border-slate-100 hover:border-blue-200 group"
                            @click="loadDemoConversation(d)"
                        >
                            <div class="text-slate-700 group-hover:text-blue-700 font-medium truncate">{{ d.label }}</div>
                            <div class="text-slate-400 text-[11px] mt-0.5">{{ d.desc }}</div>
                        </button>
                    </div>
                </div>

                <!-- Messages -->
                <template v-for="message in messages" :key="message.id">
                    <!-- User Message -->
                    <div v-if="message.role === 'user'" class="flex justify-end">
                        <div class="max-w-[70%] flex items-start justify-end gap-2">
                            <div class="min-w-0 max-w-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-2xl rounded-tr-md shadow-sm">
                                <div class="prose prose-invert w-full max-w-none text-left text-sm [&_p]:my-1" v-html="renderAssistantMarkdown(message.content)"/>
                            </div>
                            <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                                <User class="w-5 h-5 text-white"/>
                            </div>
                        </div>
                    </div>

                    <!-- Assistant Message -->
                    <div v-else-if="message.role === 'assistant'" class="flex justify-start">
                        <div class="max-w-[70%] flex items-start gap-2">
                            <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm bg-gradient-to-br from-violet-500 to-fuchsia-500">
                                <Bot class="w-5 h-5 text-white"/>
                            </div>
                            <div class="px-4 py-3 rounded-2xl rounded-tl-md border shadow-sm bg-slate-50 border-slate-100">
                                <!-- Loading indicator -->
                                <div v-if="message.isLoading" class="flex items-center gap-2">
                                    <Loader2 class="w-4 h-4 text-blue-500 animate-spin"/>
                                    <span class="text-sm text-slate-500">正在思考...</span>
                                </div>

                                <!-- Error message -->
                                <div v-else-if="message.isError" class="text-sm text-red-600">
                                    {{ message.content }}
                                </div>

                                <!-- Normal response -->
                                <div v-else class="prose prose-sm max-w-none text-slate-700 [&_p]:my-2" v-html="renderAssistantMarkdown(message.content)"/>

                                <!-- Action bar -->
                                <div v-if="!message.isLoading" class="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                                    <Button variant="ghost" size="icon" class="h-6 w-6" @click="copyMessage(message.content, message.id)">
                                        <component :is="copiedMessageId === message.id ? Check : Copy" :class="['w-3 h-3', copiedMessageId === message.id ? 'text-green-500' : 'text-slate-400']"/>
                                    </Button>
                                    <div class="text-xs text-slate-300 ml-auto">
                                        {{ new Date(message.timestamp).toLocaleTimeString() }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div ref="messagesEndRef"/>
            </div>

            <!-- Input Area -->
            <div class="p-4 border-t">
                <!-- File Attachment Chips -->
                <div v-if="selectedFiles.length > 0" class="flex flex-wrap items-center gap-2 mb-3">
                    <span class="text-xs text-slate-400 shrink-0">附件</span>
                    <div
                        v-for="f in selectedFiles"
                        :key="f.id"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200"
                    >
                        <Paperclip class="w-3 h-3 shrink-0"/>
                        <span class="max-w-[120px] truncate" :title="f.name">{{ f.name }}</span>
                        <button
                            type="button"
                            class="ml-0.5 rounded-full p-0.5 hover:bg-blue-200/50 transition-colors shrink-0"
                            @click="removeFile(f.id)"
                        >
                            <X class="w-3 h-3"/>
                        </button>
                    </div>
                </div>

                <div class="flex items-start gap-3">
                    <div
                        class="flex-1 min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20"
                        @paste="handlePaste"
                    >
                        <textarea
                            ref="inputRef"
                            v-model="inputText"
                            placeholder="输入您的查询问题...（可直接粘贴 CSV/XLSX 文件）"
                            class="w-full min-h-[24px] max-h-[120px] resize-none border-0 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none px-4 py-3"
                            rows="1"
                            @keydown="handleKeydown"
                        />
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <div class="flex items-center gap-1">
                            <!-- File Upload Button -->
                            <label class="h-8 w-8 shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center cursor-pointer" title="上传文件 (CSV/XLSX)">
                                <Paperclip class="w-4 h-4 text-slate-500"/>
                                <input type="file" accept=".csv,.xlsx,.xls" multiple class="hidden" @change="handleFileSelect"/>
                            </label>
                            <Button
                                :disabled="!canSendMessage"
                                class="h-10 shrink-0 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2"
                                @click="handleSend"
                            >
                                <span class="text-sm font-medium">发送</span>
                                <Send v-if="!activeSessionIsLoading" class="w-4 h-4"/>
                                <Loader2 v-else class="w-4 h-4 animate-spin"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Session Dialog -->
            <ConfirmDialog ref="deleteSessionDialog"/>
        </div>

        <!-- ====== Right Output Panel ====== -->
        <div
            v-if="currentOutput && !outputPanelHidden"
            class="flex shrink-0 rounded-xl border shadow-sm overflow-hidden bg-white transition-all duration-300"
            :style="{ width: `${outputPanelWidthPx}px` }"
        >
            <!-- Resize handle -->
            <div
                class="w-1.5 shrink-0 cursor-ew-resize hover:bg-blue-400/40 active:bg-blue-500/50 border-r border-slate-100 flex items-stretch justify-center group touch-none"
                @pointerdown="onOutputPanelResizeDown"
            >
                <span class="w-px h-8 self-center rounded-full bg-slate-300 group-hover:bg-blue-400 transition-colors"/>
            </div>

            <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
                <!-- Panel Header -->
                <div class="px-4 py-3 border-b flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-2 text-sm font-medium text-slate-800 min-w-0">
                        <component :is="outputIcon" class="w-4 h-4 shrink-0" :class="outputIconClass"/>
                        <span class="truncate">{{ currentOutput.title || '输出' }}</span>
                        <span v-if="allOutputs.length > 1" class="text-xs text-slate-400 ml-1">
                            {{ currentOutputIdx + 1 }}/{{ allOutputs.length }}
                        </span>
                    </div>
                    <div class="flex items-center gap-1">
                        <!-- Prev/Next output navigation -->
                        <button
                            v-if="allOutputs.length > 1"
                            class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30"
                            :disabled="manualOutputOffset >= allOutputs.length - 1"
                            @click="prevOutput"
                        >◀</button>
                        <button
                            v-if="allOutputs.length > 1"
                            class="h-6 w-6 rounded hover:bg-slate-100 flex items-center justify-center text-slate-400 disabled:opacity-30"
                            :disabled="manualOutputOffset <= 0"
                            @click="nextOutput"
                        >▶</button>
                        <Button variant="ghost" size="icon" class="h-7 w-7" @click="hideOutputPanel">
                            <X class="w-3.5 h-3.5"/>
                        </Button>
                    </div>
                </div>

                <!-- Panel Body -->
                <div class="flex-1 overflow-auto">
                    <!-- card: 需求确认卡 -->
                    <div v-if="currentOutput.type === 'card'" class="p-5 space-y-3">
                        <div class="flex flex-wrap gap-2">
                            <span v-for="(v,k) in currentOutput.content" :key="k"
                                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                                  :class="k === '核心问题' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'"
                            >
                                <span class="text-slate-400">{{ k }}</span>
                                <span>{{ v }}</span>
                            </span>
                        </div>
                        <div class="text-xs text-slate-400 mt-2">✅ 需求已确认，继续对话进入分析思路</div>
                    </div>

                    <!-- framework: 分析思路 / 指标框架 -->
                    <div v-else-if="currentOutput.type === 'framework'" class="p-5 space-y-4">
                        <div class="text-xs text-slate-500 bg-slate-50 rounded-lg p-3">{{ currentOutput.desc }}</div>
                        <div v-for="(dir, di) in (currentOutput.content.分析拆解 || currentOutput.content.维度 || [])" :key="di"
                             class="rounded-lg border border-slate-200 overflow-hidden">
                            <div class="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                <span class="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">{{ di + 1 }}</span>
                                <span class="text-sm font-medium text-slate-700">{{ dir.名称 || dir.分析方向 }}</span>
                                <span class="text-xs text-slate-400">{{ dir.目的 || dir.要回答的问题 }}</span>
                            </div>
                            <div v-if="dir.指标 && dir.指标.length" class="p-3">
                                <table class="w-full text-xs">
                                    <thead>
                                        <tr class="text-slate-400 border-b border-slate-100">
                                            <th class="text-left py-1 pr-2">ID</th>
                                            <th class="text-left py-1 pr-2">名称</th>
                                            <th class="text-left py-1">类型</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(ind, ii) in dir.指标" :key="ii" class="border-b border-slate-50 last:border-0">
                                            <td class="py-1 pr-2 text-slate-500 font-mono text-[11px]">{{ ind.id }}</td>
                                            <td class="py-1 pr-2 text-slate-700">{{ ind.名称 }}</td>
                                            <td class="py-1">
                                                <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">{{ ind.类型 }}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- html: Demo 报告 -->
                    <div v-else-if="currentOutput.type === 'html'" class="h-full">
                        <iframe
                            class="w-full h-full border-0"
                            :srcdoc="currentOutput.content"
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>

                    <!-- sql: SQL 脚本 -->
                    <div v-else-if="currentOutput.type === 'sql'" class="p-5">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs text-slate-400">SQL 脚本</span>
                            <Button variant="ghost" size="sm" class="h-6 text-xs" @click="copyOutputContent">
                                <Copy class="w-3 h-3 mr-1"/>复制
                            </Button>
                        </div>
                        <pre class="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-[80vh] font-mono leading-relaxed"><code>{{ currentOutput.content }}</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {computed, nextTick, ref, useTemplateRef, watch} from 'vue';
    import {Button} from '@/components/ui/button';
    import {Bot, Brain, Check, ChevronLeft, ChevronRight, Code2, Copy, Eye, FileJson, Layout, Loader2, Paperclip, Send, User, X} from 'lucide-vue-next';
    import {useSessionStore} from '@/store/session.js';
    import ConfirmDialog from '@/components/ConfirmDialog.vue';
    import {useUserStore} from '@/store/user.js';
    import {useMarkdown} from '@/composables/use-markdown.js';
    import {ElMessage} from 'element-plus';
    import {useFileUpload} from '@/composables/useFileUpload.js';
    import {useOutputParser} from '@/composables/useOutputParser.js';

    export default {
        name: 'SmartQueryAgent',
        components: {
            Button, Bot, Brain, Check, ChevronLeft, ChevronRight, Code2, Copy, Eye, FileJson, Layout, Loader2, Paperclip, Send, User, X,
            ConfirmDialog,
        },
        setup() {
            // ============= Store =============
            const sessionStore = useSessionStore();
            const userStore = useUserStore();

            // ============= State =============
            const inputText = ref('');
            const copiedMessageId = ref(null);
            const messagesEndRef = useTemplateRef('messagesEndRef');
            const messagesContainerRef = useTemplateRef('messagesContainerRef');
            const deleteSessionDialog = useTemplateRef('deleteSessionDialog');
            const inputRef = useTemplateRef('inputRef');

            const {renderAssistantMarkdown} = useMarkdown();
            const {selectedFiles, hasFiles, validateAndAddFiles, removeFile, clearFiles, readFileContents} = useFileUpload();

            // ============= Computed (must be before useOutputParser) =============
            const messages = computed(() => sessionStore.messages);
            const activeSession = computed(() => sessionStore.activeSession);
            const activeSessionIsLoading = computed(() => sessionStore.activeSessionIsLoading);

            // ============= Output Parser (右侧面板) =============
            const { allOutputs } = useOutputParser(messages);
            const manualOutputOffset = ref(0); // 0 = latest, 1 = one back, etc.

            // 当前显示的输出（默认最新，用户可手动翻页）
            const currentOutput = computed(() => {
                const arr = allOutputs.value;
                if (arr.length === 0) return null;
                const idx = Math.max(0, arr.length - 1 - manualOutputOffset.value);
                return arr[idx] || null;
            });
            const currentOutputIdx = computed(() => {
                const arr = allOutputs.value;
                return arr.length === 0 ? 0 : Math.max(0, arr.length - 1 - manualOutputOffset.value);
            });

            const outputPanelWidthPx = ref(480);
            let outputResizeStartX = 0;
            let outputResizeStartW = 0;
            let outputResizing = false;
            const OUTPUT_MIN_WIDTH = 280;
            const OUTPUT_MAX_WIDTH = 1000;

            const outputIcon = computed(() => {
                const t = currentOutput.value?.type;
                if (t === 'card') return FileJson;
                if (t === 'framework') return Layout;
                if (t === 'html') return Eye;
                if (t === 'sql') return Code2;
                return FileJson;
            });
            const outputIconClass = computed(() => {
                const t = currentOutput.value?.type;
                if (t === 'card') return 'text-emerald-500';
                if (t === 'framework') return 'text-blue-500';
                if (t === 'html') return 'text-orange-500';
                if (t === 'sql') return 'text-violet-500';
                return 'text-slate-500';
            });

            function prevOutput() {
                const max = allOutputs.value.length - 1;
                manualOutputOffset.value = Math.min(max, manualOutputOffset.value + 1);
            }
            function nextOutput() {
                manualOutputOffset.value = Math.max(0, manualOutputOffset.value - 1);
            }
            const outputPanelHidden = ref(false);
            function hideOutputPanel() {
                outputPanelHidden.value = true;
            }
            // Auto-show and reset when new output arrives
            watch(() => allOutputs.value.length, () => {
                outputPanelHidden.value = false;
                manualOutputOffset.value = 0;
            });

            function onOutputPanelResizeDown(e) {
                e.preventDefault();
                outputResizeStartX = e.clientX;
                outputResizeStartW = outputPanelWidthPx.value;
                outputResizing = true;
                e.target.setPointerCapture?.(e.pointerId);
                window.addEventListener('pointermove', _onOutputResizeMove);
                window.addEventListener('pointerup', _onOutputResizeUp);
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
            }
            function _onOutputResizeMove(e) {
                if (!outputResizing) return;
                const dx = outputResizeStartX - e.clientX;
                outputPanelWidthPx.value = Math.max(OUTPUT_MIN_WIDTH, Math.min(OUTPUT_MAX_WIDTH, outputResizeStartW + dx));
            }
            function _onOutputResizeUp() {
                outputResizing = false;
                window.removeEventListener('pointermove', _onOutputResizeMove);
                window.removeEventListener('pointerup', _onOutputResizeUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }

            function copyOutputContent() {
                const txt = currentOutput.value?.content;
                if (!txt) return;
                const text = typeof txt === 'string' ? txt : JSON.stringify(txt, null, 2);
                navigator.clipboard.writeText(text).then(() => {
                    ElMessage.success('已复制');
                });
            }

            // ============= 数据报告下载演示（纯静态）=============
            const demoConversations = [
                {
                    id: 'multi-report',
                    label: '数据报告',
                    desc: '多报告浏览选择 → 选第2个 → 确认下载',
                    messages: [
                        { role: 'user', content: '数据报告' },
                        { role: 'assistant', content: `您当前有权限下载的数据报告共 5 个：

1. 黄埔区货运车辆数据分析需求2.3 — 3 个文件（最新：7月14日）
2. 左海供应链多车轨迹查询 — 3 个文件（最新：7月14日）
3. 全国车辆入网日报 — 4 个文件（最新：7月14日）
4. 华南区域运单汇总需求1.1 — 2 个文件（最新：7月13日）
5. 成都区域运力统计周报 — 2 个文件（最新：7月10日）

要下载哪一个？直接说名称或序号即可。` },
                        { role: 'user', content: '第2个' },
                        { role: 'assistant', content: `已找到「左海供应链多车轨迹查询」，共 3 个文件：

📄 左海供应链多车轨迹查询1.0_20260714_task-38503_file52001.csv
📄 左海供应链多车轨迹查询1.0_20260714_task-38503_file52002.csv
📄 左海供应链多车轨迹查询1.0_20260714_task-38503_file52003.csv

确认下载吗？` },
                        { role: 'user', content: '确认' },
                        { role: 'assistant', content: `正在准备文件…

✅ 左海供应链多车轨迹查询1.0_20260714_task-38503_file52001.csv
✅ 左海供应链多车轨迹查询1.0_20260714_task-38503_file52002.csv
✅ 左海供应链多车轨迹查询1.0_20260714_task-38503_file52003.csv

全部下载完成！` },
                    ],
                },
                {
                    id: 'exact-match',
                    label: '下载全国车辆入网日报数据报告',
                    desc: '关键词精准命中 → 确认下载',
                    messages: [
                        { role: 'user', content: '下载全国车辆入网日报数据报告' },
                        { role: 'assistant', content: `已找到「全国车辆入网日报」，共 4 个文件：

📄 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
📄 全国车辆入网日报2.1_20260714_task-39001_file52101.csv
📄 全国车辆入网日报2.1_20260713_task-38990_file52080.csv
📄 全国车辆入网日报2.1_20260712_task-38980_file52060.csv

确认下载吗？` },
                        { role: 'user', content: '确认' },
                        { role: 'assistant', content: `正在准备文件…

✅ 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
✅ 全国车辆入网日报2.1_20260714_task-39001_file52101.csv
✅ 全国车辆入网日报2.1_20260713_task-38990_file52080.csv
✅ 全国车辆入网日报2.1_20260712_task-38980_file52060.csv

全部下载完成！` },
                    ],
                },
                {
                    id: 'keyword-search',
                    label: '有没有货运的数据报告',
                    desc: '关键词模糊匹配 → 选黄埔 → 确认下载',
                    messages: [
                        { role: 'user', content: '有没有货运的数据报告' },
                        { role: 'assistant', content: `「货运」匹配到 2 个数据报告：

1. 黄埔区货运车辆数据分析需求2.3 — 3 个文件
2. 华南区域运单汇总需求1.1 — 2 个文件

您要下载哪一个？` },
                        { role: 'user', content: '黄埔区' },
                        { role: 'assistant', content: `已找到「黄埔区货运车辆数据分析需求2.3」，共 3 个文件：

📄 黄埔区货运车辆数据分析需求2.3_20260714_task-37786_file518336.csv
📄 黄埔区货运车辆数据分析需求2.3_20260714_task-37786_file518337.csv
📄 黄埔区货运车辆数据分析需求2.3_20260713_task-37785_file518335.csv

确认下载吗？` },
                        { role: 'user', content: '确认' },
                        { role: 'assistant', content: `正在准备文件…

✅ 黄埔区货运车辆数据分析需求2.3_20260714_task-37786_file518336.csv
✅ 黄埔区货运车辆数据分析需求2.3_20260714_task-37786_file518337.csv
✅ 黄埔区货运车辆数据分析需求2.3_20260713_task-37785_file518335.csv

全部下载完成！` },
                    ],
                },
                {
                    id: 'no-match',
                    label: '有没有北京的数据报告',
                    desc: '无匹配 → 展示全部可用 → 选入网日报 → 确认下载',
                    messages: [
                        { role: 'user', content: '有没有北京的数据报告' },
                        { role: 'assistant', content: `未找到与「北京」匹配的数据报告。

您当前有权限下载的数据报告共 3 个：
1. 黄埔区货运车辆数据分析需求2.3 — 3 个文件
2. 左海供应链多车轨迹查询 — 3 个文件
3. 全国车辆入网日报 — 4 个文件

要下载哪一个？` },
                        { role: 'user', content: '入网日报' },
                        { role: 'assistant', content: `已找到「全国车辆入网日报」，共 4 个文件：

📄 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
📄 全国车辆入网日报2.1_20260714_task-39001_file52101.csv
📄 全国车辆入网日报2.1_20260713_task-38990_file52080.csv
📄 全国车辆入网日报2.1_20260712_task-38980_file52060.csv

确认下载吗？` },
                        { role: 'user', content: '确认' },
                        { role: 'assistant', content: `正在准备文件…

✅ 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
✅ 全国车辆入网日报2.1_20260714_task-39001_file52101.csv
✅ 全国车辆入网日报2.1_20260713_task-38990_file52080.csv
✅ 全国车辆入网日报2.1_20260712_task-38980_file52060.csv

全部下载完成！` },
                    ],
                },
                {
                    id: 'filter-by-date',
                    label: '只要7月14日的数据',
                    desc: '按日期筛选 → 只下载指定日期的文件',
                    messages: [
                        { role: 'user', content: '下载全国车辆入网日报数据报告' },
                        { role: 'assistant', content: `已找到「全国车辆入网日报」，共覆盖 4 个日期，4 个文件：

📅 2026-07-14
  📄 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
  📄 全国车辆入网日报2.1_20260714_task-39001_file52101.csv

📅 2026-07-13
  📄 全国车辆入网日报2.1_20260713_task-38990_file52080.csv

📅 2026-07-12
  📄 全国车辆入网日报2.1_20260712_task-38980_file52060.csv

📅 2026-07-11
  📄 全国车辆入网日报2.1_20260711_task-38970_file52040.csv

您可以下载全部，也可以指定某个日期下载。` },
                        { role: 'user', content: '只要7月14日的' },
                        { role: 'assistant', content: `已筛选「全国车辆入网日报」2026-07-14 的文件，共 2 个：

📄 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
📄 全国车辆入网日报2.1_20260714_task-39001_file52101.csv

确认下载这 2 个文件吗？` },
                        { role: 'user', content: '确认' },
                        { role: 'assistant', content: `正在准备文件…

✅ 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
✅ 全国车辆入网日报2.1_20260714_task-39001_file52101.csv

下载完成！` },
                    ],
                },
                {
                    id: 'multi-req-pick',
                    label: '数据报告（新版）',
                    desc: '两个需求 → 选第一个 → 按日期筛选 → 下载',
                    messages: [
                        { role: 'user', content: '数据报告' },
                        { role: 'assistant', content: `您当前有权限下载的数据报告共 2 个：

1. 全国车辆入网日报 — 4 个文件（最新：7月14日）
2. 黄埔区货运车辆数据分析需求2.3 — 3 个文件（最新：7月14日）

要下载哪一个？` },
                        { role: 'user', content: '第一个' },
                        { role: 'assistant', content: `已找到「全国车辆入网日报」，共 4 个文件：

📅 2026-07-14
  📄 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
  📄 全国车辆入网日报2.1_20260714_task-39001_file52101.csv

📅 2026-07-13
  📄 全国车辆入网日报2.1_20260713_task-38990_file52080.csv

📅 2026-07-12
  📄 全国车辆入网日报2.1_20260712_task-38980_file52060.csv

您可以全部下载，也可以指定某个日期。` },
                        { role: 'user', content: '只要7月14日的' },
                        { role: 'assistant', content: `已为您筛选 2026-07-14 的文件，共 2 个：

📄 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
📄 全国车辆入网日报2.1_20260714_task-39001_file52101.csv

确认下载吗？` },
                        { role: 'user', content: '确认' },
                        { role: 'assistant', content: `正在准备文件…

✅ 全国车辆入网日报2.1_20260714_task-39001_file52100.csv
✅ 全国车辆入网日报2.1_20260714_task-39001_file52101.csv

下载完成！` },
                    ],
                },
            ];

            // ============= Computed =============
            const canSendMessage = computed(() => {
                if (activeSessionIsLoading.value) return false;
                return inputText.value.trim().length > 0;
            });

            // ============= Helpers =============
            function scrollToBottom() {
                nextTick(() => {
                    const container = messagesContainerRef.value;
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });
            }

            function copyMessage(content, id) {
                navigator.clipboard.writeText(content).then(() => {
                    copiedMessageId.value = id;
                    setTimeout(() => { copiedMessageId.value = null; }, 2000);
                });
            }

            function handleKeydown(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
            }

            // ============= 纯静态演示：加载预制会话 =============
            function loadDemoConversation(demo) {
                const newSession = {
                    id: 'demo-' + Date.now(),
                    name: demo.label,
                    messages: [],
                    createdAt: new Date(),
                };
                sessionStore.sessions.unshift(newSession);
                sessionStore.activeSessionId = newSession.id;

                demo.messages.forEach(m => {
                    sessionStore.addMessage(m.role, m.content, {}, newSession.id);
                });

                scrollToBottom();
            }

            // ============= Send Message（纯静态演示）=============
            async function handleSend() {
                const text = inputText.value.trim();
                if (!text) return;

                // Ensure active session exists
                if (!activeSession.value) {
                    createSession();
                }
                if (!activeSession.value) return;

                const sessionId = activeSession.value.id;
                if (sessionStore.loadingSessionIds.has(sessionId)) return;

                // Clear input
                inputText.value = '';
                clearFiles();
                sessionStore.setSessionLoading(sessionId, true);

                // Add user message
                sessionStore.addMessage('user', text, {}, sessionId);
                scrollToBottom();

                // Auto-name session
                const session = sessionStore.getSessionById(sessionId);
                if (session && session.messages.filter(m => m.role === 'user').length <= 1) {
                    session.name = text.length > 20 ? text.slice(0, 20) + '...' : text;
                }

                // Simulate loading delay
                const loadingMsg = sessionStore.addMessage('assistant', '', {isLoading: true}, sessionId);
                if (loadingMsg) {
                    sessionStore.pendingAssistantMessageIdBySession = {
                        ...sessionStore.pendingAssistantMessageIdBySession,
                        [sessionId]: loadingMsg.id,
                    };
                }

                // 纯静态演示：返回固定提示
                await new Promise(resolve => setTimeout(resolve, 600));
                const demoResponse = '👋 您好！当前为**纯静态演示模式**。\n\n请点击上方预制案例体验数据报告下载流程，或输入「数据报告」体验完整对话。';
                if (loadingMsg) {
                    sessionStore.updateMessage(loadingMsg.id, {
                        content: demoResponse,
                        isLoading: false,
                    }, sessionId);
                }
                sessionStore.finishPendingSession(sessionId);
                scrollToBottom();
            }

            // ============= Session Operations =============
            function createSession() {
                const newSession = sessionStore.createSession();
                scrollToBottom();
            }

            function selectSession(id) {
                sessionStore.selectSession(id);
                scrollToBottom();
            }

            function confirmDeleteSession(id) {
                deleteSessionDialog.value?.confirm({
                    message: '确定要删除会话吗？此操作不可撤销。',
                    title: '删除会话',
                }).then(() => {
                    deleteSession(id);
                }).catch(() => {});
            }

            function deleteSession(id) {
                sessionStore.deleteSession(id);
                if (!sessionStore.activeSessionId) {
                    createSession();
                }
            }

            // ============= File Handlers =============
            function handleFileSelect(e) {
                const files = e.target.files;
                if (files && files.length > 0) {
                    const warnings = validateAndAddFiles(files);
                    warnings.forEach(w => ElMessage.warning(w));
                }
                // Reset input so same file can be re-selected
                e.target.value = '';
            }

            function handlePaste(e) {
                const items = e.clipboardData?.items;
                if (!items) return;
                const files = [];
                for (const item of items) {
                    if (item.kind === 'file') {
                        files.push(item.getAsFile());
                    }
                }
                if (files.length > 0) {
                    const warnings = validateAndAddFiles(files);
                    warnings.forEach(w => ElMessage.warning(w));
                }
            }

            // ============= File Contents Helper =============
            function buildMessageWithFiles(userMessage, fileContents = []) {
                if (!fileContents || fileContents.length === 0) return userMessage;

                const fileContexts = fileContents.map(f => {
                    const truncateLength = 10000;
                    let content = f.content;
                    let note = '';
                    if (content.length > truncateLength) {
                        content = content.slice(0, truncateLength);
                        note = `\n... (文件内容已截断，原始大小 ${f.content.length} 字符)`;
                    }
                    return `\`\`\`文件: ${f.name}\n${content}${note}\n\`\`\``;
                }).join('\n\n');

                return `以下是用户上传的文件内容：\n\n${fileContexts}\n\n---\n用户问题：${userMessage}`;
            }

            // ============= Init =============
            // 首次加载时，预置演示会话到历史列表
            if (sessionStore.sessions.length === 0) {
                demoConversations.forEach(demo => {
                    const s = {
                        id: 'demo-' + demo.id,
                        name: demo.label,
                        messages: [],
                        createdAt: new Date(Date.now() - demoConversations.indexOf(demo) * 60000),
                    };
                    demo.messages.forEach(m => {
                        s.messages.push({
                            id: s.id + '-msg-' + s.messages.length,
                            role: m.role,
                            content: m.content,
                            timestamp: new Date(),
                        });
                    });
                    sessionStore.sessions.unshift(s);
                });
                // 默认选中第一个演示会话
                sessionStore.activeSessionId = sessionStore.sessions[0].id;
            }

            return {
                // State
                inputText,
                demoConversations,
                copiedMessageId,
                messagesEndRef,
                messagesContainerRef,
                inputRef,
                deleteSessionDialog,
                // Files
                selectedFiles,
                hasFiles,
                // Store
                sessionStore,
                userStore,
                activeSession,
                messages,
                activeSessionIsLoading,
                canSendMessage,
                // Methods
                handleSend,
                handleKeydown,
                loadDemoConversation,
                renderAssistantMarkdown,
                copyMessage,
                scrollToBottom,
                createSession,
                selectSession,
                confirmDeleteSession,
                deleteSession,
                handleFileSelect,
                handlePaste,
                removeFile,
                // Output panel
                currentOutput,
                allOutputs,
                outputPanelHidden,
                manualOutputOffset,
                currentOutputIdx,
                outputPanelWidthPx,
                outputIcon,
                outputIconClass,
                prevOutput,
                nextOutput,
                hideOutputPanel,
                onOutputPanelResizeDown,
                copyOutputContent,
            };
        },
        data() {
            return {
                Check,
                Copy,
            };
        },
        mounted() {
            window.qsm = this;
        },
        unmounted() {
            window.qsm = null;
        },
    };
</script>
<style lang="scss">
.animat-text {
    margin-left: 5px;
    display: inline-block;
    overflow: hidden;
    position: relative;
    top: 2px;
}
</style>
