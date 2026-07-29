<template>
    <Dialog :open="open" @update:open="open=false">
        <DialogContent class="sm:max-w-[600px] rounded-2xl p-6">
            <DialogTitle class="text-xl font-semibold text-gray-900">{{formData.id ? '编辑' : '新建'}}自定义模板</DialogTitle>
            <div class="space-y-6 mt-4">
                <div>
                    <Label class="mb-2 text-base font-medium text-gray-700">模板标题 <span class="text-red-500">*</span></Label> <Input v-model="formData.title" placeholder="请输入模板标题，如：煤炭运输分析" maxlength="50" class="rounded-lg"/>
                    <div class="text-right text-sm text-gray-400 mt-1">{{ formData.title.length }}/50</div>
                </div>

                <div>
                    <Label class="mb-2 text-base font-medium text-gray-700">维度说明 <span class="text-red-500">*</span> <span class="text-sm text-gray-400 ml-2">最多1000字</span></Label> <Textarea v-model="formData.content" placeholder="【分析目的】&#10;&#10;【分析维度】" :rows="8" maxlength="1000" class="rounded-lg resize-none"/>
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3 text-sm text-yellow-800">格式示例：使用【分析目的】和【分析维度】标签组织内容，支持多维度列举</div>
                    <div class="text-right text-sm text-gray-400 mt-1">{{ formData.content.length }}/1000 字</div>
                </div>

                <div>
                    <Label class="mb-2 text-base font-medium text-gray-700">预览效果</Label>
                    <div class="border border-gray-200 rounded-lg p-4 min-h-[150px] bg-gray-50 whitespace-pre-wrap text-sm">{{ formData.content || '预览内容将显示在这里' }}</div>
                </div>
            </div>
            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button variant="outline" @click="doCancel" class="rounded-lg px-6">取消</Button>
                <Button variant="default" :loading="loading" class="bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg px-6" @click="handleConfirm">{{formData.id ? '保存' : '创建'}}模板</Button>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
    import {Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
    import {reactive, ref} from "vue";
    import {Button} from "@/components/ui/button";
    import {Input} from "@/components/ui/input";
    import {Textarea} from "@/components/ui/textarea";
    import {Label} from "@/components/ui/label";
    import {promiseCreator} from "@/tools/tools.js";
    import {template} from "@/services/template.js";
    import {ElMessage} from "element-plus";

    const open = ref(false);
    const loading = ref(false);
    let uuid = '';
    const formData = reactive({
        id: '',
        title: '',
        content: ''
    });

    const show = (args) => {
        open.value = true;
        uuid = args.uuid;
        loading.value = false;
        if(args.row){
            formData.id = args.row.id;
            formData.title = args.row.title;
            formData.content = args.row.content || args.row.description;

        }else {
            formData.title = '';
            formData.content = '';
        }
    };

    const doCancel = () => {
        open.value = false;
        loading.value = false;
        promiseCreator.reject(uuid, null);
    };

    const handleConfirm = () => {
        if (!formData.title.trim()) {
            ElMessage.error('请输入模板标题');
            return;
        }
        if (!formData.content.trim()) {
            ElMessage.error('请输入维度说明');
            return;
        }
        if (loading.value) return;

        loading.value = true;
        let api = template.insert;
        if(formData.id){
            api = template.update;
        }
        return api(formData).then(res=>{
            let rData = res.data;
            promiseCreator.resolve(uuid, rData);
            ElMessage.success(`模板${formData.id ? '保存' : '创建'}成功`);
            open.value = false;
        }).catch((e) => {
            ElMessage.error('操作失败');
        }).finally(() => {
            loading.value = false;
        });
    };

    defineExpose({show});
</script>
