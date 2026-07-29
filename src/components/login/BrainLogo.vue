<script>
    export default{
        props: {
            iconClass: {
                type: String,
                default: 'w-9 h-9'
            }
        }
    };
</script>

<template>
    <svg class="text-white" :class="iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 4C8 4 5 7 5 11C5 15 8 18 12 18" class="text-cyan-400"/>
        <path d="M12 4C16 4 19 7 19 11C19 15 16 18 12 18" class="text-blue-400"/>
        <path d="M8 8C8 8 9 9 10 8" stroke-linecap="round"/>
        <path d="M16 8C16 8 15 9 14 8" stroke-linecap="round"/>
        <path d="M7 12C7 12 8.5 13 10 12" stroke-linecap="round"/>
        <path d="M17 12C17 12 15.5 13 14 12" stroke-linecap="round"/>
        <path d="M9 15C9 15 10.5 16 12 15C13.5 16 15 15 15 15" stroke-linecap="round"/>
        <circle cx="12" cy="6" r="1" class="fill-cyan-300"/>
        <circle cx="9" cy="10" r="0.8" class="fill-blue-300"/>
        <circle cx="15" cy="10" r="0.8" class="fill-cyan-300"/>
        <circle cx="12" cy="14" r="1" class="fill-blue-300"/>
    </svg>
</template>
