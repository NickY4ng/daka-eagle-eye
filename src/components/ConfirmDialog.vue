<template>
    <Dialog :open="open" @update:open="handleCancel">
        <DialogContent class="max-w-sm">
            <DialogHeader>
                <DialogTitle>{{ title }}</DialogTitle>
            </DialogHeader>
            <p class="text-sm text-slate-600 py-2">{{ message }}</p>
            <div class="flex justify-end gap-3">
                <Button variant="outline" :disabled="loading" @click="handleCancel">{{ cancelLabel }}</Button>
                <Button :disabled="loading" @click="handleConfirm">
                    <Loader2 v-if="loading" class="w-4 h-4 animate-spin mr-1"/>
                    {{ confirmLabel }}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>
<script>
    import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
    import {Button} from '@/components/ui/button';
    import {Loader2} from 'lucide-vue-next';

    export default {
        name: 'ConfirmDialog',
        components: {Dialog, DialogContent, DialogHeader, DialogTitle, Button, Loader2},
        data() {
            return {
                open: false,
                title: '',
                message: '',
                loading: false,
                resolveFn: null,
                rejectFn: null,
                cancelLabel: '取消',
                confirmLabel: '确定'
            };
        },
        methods: {
            /**
             * @param {object} options 参数对象
             * @param {string?} options.title 提示标题
             * @param {string?} options.message 提示内容
             * @param {string?} options.cancelLabel 取消按钮文字
             * @param {string?} options.confirmLabel 确定按钮文字
             * @returns {Promise<void>} 确认操作的 Promise
             * */
            confirm(options) {
                this.title = options.title || '确认操作';
                this.message = options.message;
                this.loading = false;
                this.open = true;
                this.cancelLabel = options.cancelLabel || '取消';
                this.confirmLabel = options.confirmLabel || '确定';
                return new Promise((resolve, reject) => {
                    this.resolveFn = resolve;
                    this.rejectFn = reject;
                });
            },
            handleConfirm() {
                if (this.loading) return;
                this.loading = true;
                this.resolveFn?.();
                this.open = false;
                this.loading = false;
            },
            handleCancel() {
                if (this.loading) return;
                this.rejectFn?.();
                this.open = false;
            }
        }
    };
</script>
