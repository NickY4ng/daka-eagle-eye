<script setup>
    import { SelectRoot } from 'radix-vue';

    const props = defineProps({
        defaultValue: { type: String, default: undefined },
        modelValue: { type: String, default: undefined },
        disabled: { type: Boolean, default: false },
        open: { type: Boolean, default: undefined },
        defaultOpen: { type: Boolean, default: false }
    });

    const emit = defineEmits(['update:modelValue', 'update:open']);
</script>

<template>
    <SelectRoot
        :default-value="props.defaultValue"
        :model-value="props.modelValue"
        :disabled="props.disabled"
        :open="props.open"
        :default-open="props.defaultOpen"
        @update:model-value="emit('update:modelValue', $event)"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </SelectRoot>
</template>
