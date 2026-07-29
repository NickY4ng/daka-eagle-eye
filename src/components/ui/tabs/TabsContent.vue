<script setup>
    import { computed } from 'vue';
    import { TabsContent } from 'radix-vue';
    import { cn } from '@/lib/utils';

    const props = defineProps({
        value: { type: String, required: true },
        class: { type: String, default: '' }
    });

    const classes = computed(() =>
        cn(
            'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            props.class,
        ),
    );
</script>

<template>
    <TabsContent :value="value" :class="classes">
        <slot />
    </TabsContent>
</template>
