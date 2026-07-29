<script setup>
    import { computed } from 'vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' },
        defaultValue: { type: String, default: undefined },
        modelValue: { type: String, default: undefined },
        disabled: { type: Boolean, default: false },
        placeholder: { type: String, default: '' },
        rows: { type: Number, default: undefined }
    });

    const emit = defineEmits(['update:modelValue']);

    const classes = computed(() =>
        cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            props.class,
        ),
    );

    function onInput(event) {
        emit('update:modelValue', event.target.value);
    }
</script>

<template>
    <textarea
        :class="classes"
        :value="modelValue ?? defaultValue"
        :disabled="disabled"
        :placeholder="placeholder"
        :rows="rows"
        @input="onInput"
    />
</template>
