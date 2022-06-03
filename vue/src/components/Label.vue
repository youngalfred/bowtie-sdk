<script setup lang="ts">
    import type { PropType } from 'vue';
    import type { Field, Node } from '@/types'
    
    const {field} = defineProps({
        field: {
            type: Object as PropType<Node>,
            required: true
        }
    })
    const { decoration = '' } = field as Field
</script>

<template>
    <img v-if="decoration" :src="decoration"/>
    <h3 :id="field.id" v-html="field.label" />
</template>

<style scoped>
    h3 {
        margin-top: 1em;
        align-self: center;
    }
    img {
        max-height: 5em;
        max-width: 8em;
        width: auto;
        display: block;
        margin: 0 auto;
    }
</style>