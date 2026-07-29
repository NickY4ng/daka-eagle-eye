<script setup>
    import {Toaster} from 'vue-sonner';

    defineProps({
        position: {type: String, default: 'bottom-right', validator: (value) => ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'].includes(value)},
        expand: {type: Boolean, default: true},
        richColors: {type: Boolean, default: false},
        closeButton: {type: Boolean, default: false},
        duration: {type: Number, default: 4000},
        theme: {type: String, default: 'system', validator: (value) => ['light', 'dark', 'system'].includes(value)}
    });
</script>

<template>
    <Toaster class="toaster group" :position="position" :expand="expand" :rich-colors="richColors" :close-button="closeButton" :duration="duration" :theme="theme" :toast-options="{
        classes: {
            toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
    }"/>
</template>
