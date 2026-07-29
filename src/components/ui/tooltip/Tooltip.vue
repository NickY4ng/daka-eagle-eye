<script setup>
    import { TooltipRoot } from 'radix-vue';

    const props = defineProps({
        defaultOpen: { type: Boolean, default: false },
        open: { type: Boolean, default: undefined },
        delayDuration: { type: Number, default: 200 }
    });

    const emit = defineEmits(['update:open']);
</script>

<template>
    <TooltipRoot
        :default-open="props.defaultOpen"
        :open="props.open"
        :delay-duration="props.delayDuration"
        @update:open="emit('update:open', $event)"
    >
        <slot />
    </TooltipRoot>
</template>
