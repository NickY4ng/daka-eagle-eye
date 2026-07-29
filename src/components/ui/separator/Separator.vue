<script setup>
    import { computed } from 'vue';
    import { Separator } from 'radix-vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' },
        orientation: { type: String, default: 'horizontal', validator: (value) => ['horizontal', 'vertical'].includes(value) },
        decorative: { type: Boolean, default: true }
    });

    const classes = computed(() =>
        cn(
            'shrink-0 bg-border',
            props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            props.class,
        ),
    );
</script>

<template>
    <Separator
        :class="classes"
        :orientation="orientation"
        :decorative="decorative"
    />
</template>
