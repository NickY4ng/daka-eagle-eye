<script setup>
    import { computed } from 'vue';
    import { TooltipContent, TooltipPortal } from 'radix-vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' },
        sideOffset: { type: Number, default: 4 },
        side: { type: String, default: 'top', validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value) }
    });

    const classes = computed(() =>
        cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.class,
        ),
    );
</script>

<template>
    <TooltipPortal>
        <TooltipContent
            :class="classes"
            :side-offset="sideOffset"
            :side="side"
        >
            <slot />
        </TooltipContent>
    </TooltipPortal>
</template>
