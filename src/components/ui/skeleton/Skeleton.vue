<script setup>
    import { computed } from 'vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        class: { type: String, default: '' }
    });

    const classes = computed(() =>
        cn('animate-pulse rounded-md bg-muted', props.class),
    );
</script>

<template>
    <div :class="classes" />
</template>
