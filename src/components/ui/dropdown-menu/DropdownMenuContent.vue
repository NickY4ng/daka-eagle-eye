<script setup>
    import { computed } from 'vue';
    import { DropdownMenuContent, DropdownMenuPortal } from 'radix-vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' },
        sideOffset: { type: Number, default: 4 },
        align: { type: String, default: 'center', validator: (value) => ['start', 'center', 'end'].includes(value) },
        side: { type: String, default: 'bottom', validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value) }
    });

    const classes = computed(() =>
        cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            props.class,
        ),
    );
</script>

<template>
    <DropdownMenuPortal>
        <DropdownMenuContent
            :class="classes"
            :side-offset="sideOffset"
            :align="align"
            :side="side"
        >
            <slot />
        </DropdownMenuContent>
    </DropdownMenuPortal>
</template>
