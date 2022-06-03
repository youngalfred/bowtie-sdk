<script setup lang="ts">
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
<div class="question" >
    <div :id="field.id" v-for="child of field.children" :key="child.id">
        <Renderer :field="child"/>
    </div>
</div>
</template>

<style scoped>
    .question {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
        grid-gap: 1em;
    }
</style>