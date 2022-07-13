<script setup lang='ts'>
    import type { PropType } from 'vue';
    import type { Field, Node } from '@/types'
    
    const props = defineProps({
        field: {
            type: Object as PropType<Node>,
            required: true
        }
    })
    const { decoration = '' } = props.field as Field
    const handleClick = () => {
        switch (props.field.kind) {
            case 'check':
                props.field.onChange(props.field.value === '1' ? '' : '1')
                break
            case 'radio':
                props.field.onChange(props.field.option.name)
            default:
                return
        }
    }
</script>

<template>
    <img v-if='decoration' :src='decoration' @click="handleClick"/>
    <h3 :id='field.id' v-html='field.label' @click="handleClick" />
</template>

<style scoped>
    h3 {
        margin-top: 1em;
        align-self: center;
    }
    img {
        margin-top: 1em !important;
        max-height: 5em;
        max-width: 8em;
        width: auto;
        display: block;
        margin: 0 auto;
    }
</style>