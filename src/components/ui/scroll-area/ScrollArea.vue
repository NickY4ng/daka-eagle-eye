<script setup>
    import { computed } from 'vue';
    import {
        ScrollAreaCorner,
        ScrollAreaRoot,
        ScrollAreaScrollbar,
        ScrollAreaThumb,
        ScrollAreaViewport,
    } from 'radix-vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' },
        orientation: { type: String, default: 'vertical', validator: (value) => ['vertical', 'horizontal'].includes(value) }
    });

    const classes = computed(() =>
        cn('relative overflow-hidden', props.class),
    );
</script>

<template>
    <ScrollAreaRoot :class="classes">
        <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
            <slot />
        </ScrollAreaViewport>
        <ScrollAreaScrollbar
            :orientation="orientation"
            :class="cn(
                'flex touch-none select-none transition-colors',
                orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
                orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
            )"
        >
            <ScrollAreaThumb class="relative flex-1 rounded-full bg-border" />
        </ScrollAreaScrollbar>
        <ScrollAreaCorner />
    </ScrollAreaRoot>
</template>
