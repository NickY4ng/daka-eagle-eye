<script setup>
    import { DropdownMenuRoot } from 'radix-vue';

    const props = defineProps({
        open: { type: Boolean, default: false },
        defaultOpen: { type: Boolean, default: false }
    });

    const emit = defineEmits(['update:open']);
</script>

<template>
    <DropdownMenuRoot
        :open="props.open"
        :default-open="props.defaultOpen"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </DropdownMenuRoot>
</template>
