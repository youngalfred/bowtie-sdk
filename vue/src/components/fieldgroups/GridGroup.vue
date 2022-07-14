<script setup lang='ts'>
    import type { PropType } from 'vue'
    import type { Fieldgroup } from '../../types'
    import Renderer from '../Renderer.vue'

    defineProps({
        field: {
            type: Object as PropType<Fieldgroup>,
            required: true
        }
    })
</script>

<template>
    <Warning :field='field' />
    <div class='question' >
        <div :id='field.id' v-for='child of field.children' :key='child.id'>
            <Renderer :field='child'/>
        </div>
    </div>
</template>

<style scoped>
    .question {
        display: grid;
        grid-template-rows: repeat;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        max-width: 100%;
        grid-gap: 1em;
    }
</style>