<template>
    <div v-if="visible" class="fixed inset-0 z-[1000] flex items-center justify-center">
        <button type="button" class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" aria-label="关闭修改密码弹窗" @click="handleClose" />

        <div class="relative w-[420px] rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
            <div class="mb-6">
                <h2 class="text-xl font-bold text-slate-800">修改密码</h2>
                <p class="mt-2 text-sm text-slate-500">新密码需为 8～20 位字母与数字组合；提交时三项均经 SHA1 后传输</p>
            </div>

            <div class="space-y-5">
                <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">原密码</label>
                    <div class="relative">
                        <Input v-model="originalPassword" :type="showOriginal ? 'text' : 'password'" placeholder="请输入原密码" autocomplete="current-password" class="h-11 border-slate-200 pr-10 focus:border-blue-500 focus:ring-blue-500/20" />
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="切换原密码可见" @click="showOriginal = !showOriginal">
                            <EyeOff v-if="showOriginal" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">新密码</label>
                    <div class="relative">
                        <Input v-model="newPassword" :type="showPassword ? 'text' : 'password'" placeholder="8～20 位，须含字母与数字" autocomplete="new-password" class="h-11 border-slate-200 pr-10 focus:border-blue-500 focus:ring-blue-500/20" />
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="切换新密码可见" @click="showPassword = !showPassword">
                            <EyeOff v-if="showPassword" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div class="space-y-1.5">
                    <label class="text-sm font-medium text-slate-700">确认新密码</label>
                    <div class="relative">
                        <Input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="请再次输入新密码" autocomplete="new-password" class="h-11 border-slate-200 pr-10 focus:border-blue-500 focus:ring-blue-500/20" />
                        <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="切换确认密码可见" @click="showConfirmPassword = !showConfirmPassword">
                            <EyeOff v-if="showConfirmPassword" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" class="h-11 w-[120px] rounded-xl border-slate-200 text-slate-700" :disabled="loading" @click="handleClose">取消</Button>
                    <Button type="button" class="h-11 w-[160px] rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-medium text-white hover:from-blue-700 hover:to-cyan-600" :disabled="loading" @click="handleSubmit">{{ loading ? '提交中...' : '提交' }}</Button>
                </div>

                <div v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ error }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from 'vue';
    import { Eye, EyeOff } from 'lucide-vue-next';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { toast } from 'vue-sonner';
    import {userApi} from '@/services/user/api.js';
    import {userHelpers} from '@/services/user/helpers.js';
    import {ElMessage} from "element-plus";

    const emit = defineEmits(['success']);

    const visible = ref(false);
    const originalPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const showOriginal = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const error = ref('');
    const loading = ref(false);

    function show() {
        visible.value = true;
        resetForm();
    }

    function handleClose() {
        visible.value = false;
        resetForm();
    }

    async function handleSubmit() {
        error.value = '';

        if (!originalPassword.value) {
            error.value = '请输入原密码';
            return;
        }
        if (!newPassword.value) {
            error.value = '请输入新密码';
            return;
        }
        if (!confirmPassword.value) {
            error.value = '请确认新密码';
            return;
        }
        if (newPassword.value !== confirmPassword.value) {
            error.value = '两次输入的新密码不一致';
            return;
        }
        if (newPassword.value === originalPassword.value) {
            error.value = '新密码不能与原密码相同';
            return;
        }

        const policyErr = userHelpers.validateNewPasswordPolicy(newPassword.value);
        if (policyErr) {
            error.value = policyErr;
            return;
        }

        loading.value = true;
        try {
            await userApi.changePassword({
                originalPassword: originalPassword.value,
                newPassword: newPassword.value,
                confirmPassword: confirmPassword.value,
            });
            ElMessage.success('密码已修改');
            emit('success');
            handleClose();
        } catch (err) {
            error.value = typeof err === 'string' ? err : '修改失败，请稍后重试';
        } finally {
            loading.value = false;
        }
    }

    function resetForm() {
        originalPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
        showOriginal.value = false;
        showPassword.value = false;
        showConfirmPassword.value = false;
        error.value = '';
        loading.value = false;
    }

    defineExpose({
        show,
    });
</script>
