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
    <div class='question' :id='field.id' v-for='child of field.children' :key='child.id'>
        <Renderer :field='child'/>
    </div>
</template>