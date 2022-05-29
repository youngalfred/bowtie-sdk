<script setup lang="ts">
    import type { PropType } from 'vue';
    import type { Node } from '../types'
    
    defineProps({
        field: {
            type: Object as PropType<Node>,
            required: true
        }
    })
</script>

<template>
    <h3 :id="field.id" v-html="field.label" />
    <!-- <LabelWithInfo label={field.label} info={field.info} styles={styles} /> -->
    <!-- <Subtitle subtitle={field.subtitle} /> -->
</template>