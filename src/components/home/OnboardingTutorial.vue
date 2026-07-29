<template>
    <!-- Tutorial Dialog -->
    <Dialog v-model:open="isOpen">
        <DialogContent class="max-w-lg" @pointer-down-outside.prevent>
            <DialogHeader>
                <div class="flex items-center justify-between">
                    <DialogTitle class="flex items-center gap-2">
                        <component :is="tutorialSteps[currentStep].icon" class="w-5 h-5 text-blue-500"/>
                        {{ tutorialSteps[currentStep].title }}
                    </DialogTitle>
                </div>
            </DialogHeader>

            <!-- Step Content -->
            <div class="py-4 min-h-[200px]">
                <!-- Step 1: Welcome -->
                <div v-if="currentStep === 0" class="space-y-4 text-center">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Brain class="w-10 h-10 text-white"/>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-800">欢迎使用大卡鹰眼智能数据决策平台</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        大卡鹰眼是一个基于AI的智能数据分析平台，帮助您快速洞察物流运输数据，做出更明智的决策。 让我们花1分钟了解核心功能。 </p>
                </div>

                <!-- Step 2: Smart Query -->
                <div v-else-if="currentStep === 1" class="space-y-4">
                    <div class="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                        <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                            <MessageSquare class="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h4 class="font-medium text-slate-800">智能对话查询</h4>
                            <p class="text-xs text-slate-500">用自然语言提问，AI自动理解并查询数据</p>
                        </div>
                    </div>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li class="flex items-start gap-2">
                            <Target class="w-4 h-4 text-blue-500 shrink-0 mt-0.5"/>
                            <span>输入类似"分析北京到上海的货物流向"的自然语言查询</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <Target class="w-4 h-4 text-blue-500 shrink-0 mt-0.5"/>
                            <span>AI自动理解需求，生成数据报表和可视化图表</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <Target class="w-4 h-4 text-blue-500 shrink-0 mt-0.5"/>
                            <span>支持深度分析模式，生成专业HTML分析报告</span>
                        </li>
                    </ul>
                </div>

                <!-- Step 3: Data Assets -->
                <div v-else-if="currentStep === 2" class="space-y-4">
                    <div class="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                        <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
                            <Database class="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h4 class="font-medium text-slate-800">数据资产管理</h4>
                            <p class="text-xs text-slate-500">统一管理和浏览所有数据资产</p>
                        </div>
                    </div>
                    <ul class="space-y-2 text-sm text-slate-600">
                        <li class="flex items-start gap-2">
                            <Lightbulb class="w-4 h-4 text-green-500 shrink-0 mt-0.5"/>
                            <span>浏览数据表、视图、API等各类数据资产</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <Lightbulb class="w-4 h-4 text-green-500 shrink-0 mt-0.5"/>
                            <span>查看字段信息、数据量、更新状态</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <Lightbulb class="w-4 h-4 text-green-500 shrink-0 mt-0.5"/>
                            <span>管理数据连接，支持多种数据源</span>
                        </li>
                    </ul>
                </div>

                <!-- Step 5: Get Started -->
                <div v-else-if="currentStep === 3" class="space-y-4 text-center">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap class="w-10 h-10 text-white"/>
                    </div>
                    <h3 class="text-lg font-semibold text-slate-800">准备就绪！</h3>
                    <p class="text-sm text-slate-500 leading-relaxed">
                        您已了解大卡鹰眼的核心功能。现在可以开始使用智能查询功能， 输入您的第一个数据分析问题吧！ </p>
                    <div class="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
                        <HelpCircle class="w-3.5 h-3.5"/>
                        <span>随时点击右下角帮助按钮重新查看引导</span>
                    </div>
                </div>
            </div>

            <!-- Progress & Navigation -->
            <div class="space-y-3">
                <Progress :model-value="progressValue" class="h-1.5"/>
                <div class="flex items-center justify-between">
                    <div class="text-xs text-slate-400">
                        {{ currentStep + 1 }} / {{ tutorialSteps.length }}
                    </div>
                    <div class="flex items-center gap-2">
                        <Button v-if="currentStep > 0" variant="outline" size="sm" class="gap-1" @click="prevStep">
                            <ChevronLeft class="w-4 h-4"/>
                            上一步
                        </Button>
                        <Button size="sm" class="gap-1" @click="nextStep">
                            {{ currentStep < tutorialSteps.length - 1 ? '下一步' : '开始使用' }}
                            <ChevronRight v-if="currentStep < tutorialSteps.length - 1" class="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
<script setup>
    import {computed, onMounted, ref} from 'vue';
    import {Button} from '@/components/ui/button';
    import {Dialog, DialogContent, DialogHeader, DialogTitle,} from '@/components/ui/dialog';
    import {Progress} from '@/components/ui/progress';
    import {Brain, ChevronLeft, ChevronRight, Database, HelpCircle, Lightbulb, MessageSquare, Sparkles, Target, Zap,} from 'lucide-vue-next';

    const TUTORIAL_KEY = 'daka_onboarding_completed';

    const tutorialSteps = [
        {id: 1, title: '欢迎使用大卡鹰眼', icon: Sparkles},
        {id: 2, title: '智能报表', icon: Brain},
        {id: 3, title: '数据资产管理', icon: Database},
        {id: 4, title: '开始使用', icon: Zap},
    ];

    const isOpen = ref(false);
    const currentStep = ref(0);

    const progressValue = computed(() => ((currentStep.value + 1) / tutorialSteps.length) * 100);

    function nextStep() {
        if (currentStep.value < tutorialSteps.length - 1) {
            currentStep.value++;
        } else {
            completeTutorial();
        }
    }

    function prevStep() {
        if (currentStep.value > 0) {
            currentStep.value--;
        }
    }

    function completeTutorial() {
        localStorage.setItem(TUTORIAL_KEY, 'true');
        isOpen.value = false;
    }

    onMounted(() => {
        const completed = localStorage.getItem(TUTORIAL_KEY);
        if (!completed) {
            isOpen.value = true;
        }
    });
    function show() {
        currentStep.value = 0;
        isOpen.value = true;
    }
    defineExpose( {show});
</script>
