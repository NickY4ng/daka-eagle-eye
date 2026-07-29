<template>
    <div v-if="files.length" class="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-slate-100 bg-slate-50/50">
        <span class="text-xs text-slate-400 shrink-0 select-none">附件</span>
        <div
            v-for="f in files"
            :key="f.id"
            :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-colors',
                f.status === 'error'
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200',
            ]"
        >
            <FileText class="w-3 h-3 shrink-0" />
            <span class="max-w-[120px] truncate" :title="f.name">{{ f.name }}</span>
            <Loader2 v-if="f.status === 'uploading'" class="w-3 h-3 animate-spin text-blue-400" />
            <AlertCircle v-else-if="f.status === 'error'" class="w-3 h-3 text-red-400 shrink-0" :title="f.error" />
            <button
                v-if="!disabled && f.status !== 'uploading'"
                type="button"
                class="ml-0.5 rounded-full p-0.5 hover:bg-blue-200/50 transition-colors shrink-0"
                :class="f.status === 'error' ? 'hover:bg-red-200/50' : 'hover:bg-blue-200/50'"
                @click="$emit('remove', f.id)"
            >
                <X class="w-3 h-3" />
            </button>
        </div>
    </div>
</template>

<script>
    import {FileText, Loader2, AlertCircle, X} from 'lucide-vue-next';

    export default {
        name: 'FileAttachmentChips',
        components: {FileText, Loader2, AlertCircle, X},
        props: {
            files: {type: Array, default: () => []},
            disabled: {type: Boolean, default: false},
        },
        emits: ['remove'],
    };
</script>
