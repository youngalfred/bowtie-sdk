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
    <!-- <LabelWithInfo label={field.label} info={field.info} styles={styles} /> -->
    <!-- <Subtitle subtitle={field.subtitle} /> -->
</template>

<style scoped>
    h3 {
        margin-top: 1em;
        align-self: center;
    }
    img {
        width: 90%;
    }
</style>