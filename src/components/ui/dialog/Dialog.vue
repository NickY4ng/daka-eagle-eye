<script>
    import {DialogRoot} from 'radix-vue';

    export default {
        name: 'Dialog',
        props: {
            open: {
                type: Boolean,
                default: false
            },
            defaultOpen: {
                type: Boolean,
                default: false
            }
        },
        components: {
            DialogRoot
        },
        watch:{
            open(value) {
                if(value){
                    setTimeout(() => {
                        document.body.style.pointerEvents = 'auto';
                    },500);
                }
            }
        },
        emits: ['update:open'],
        setup(props, {emit}) {
            return {
                props,
                emit
            };
        }
    };
</script>

<template>
    <DialogRoot :open="props.open" :default-open="props.defaultOpen" @update:open="emit('update:open', $event)">
        <slot/>
    </DialogRoot>
</template>
