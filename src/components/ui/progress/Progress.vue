<script setup>
    import { computed } from 'vue';
    import { ProgressIndicator, ProgressRoot } from 'radix-vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' },
        modelValue: { type: Number, default: 0 },
        max: { type: Number, default: 100 }
    });

    const rootClasses = computed(() =>
        cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', props.class),
    );

    const indicatorStyle = computed(() => ({
        transform: `translateX(-${100 - (props.modelValue / props.max) * 100}%)`,
    }));
</script>

<template>
    <ProgressRoot :class="rootClasses" :model-value="modelValue" :max="max">
        <ProgressIndicator
            class="h-full w-full flex-1 bg-primary transition-all"
            :style="indicatorStyle"
        />
    </ProgressRoot>
</template>
