<script setup lang="ts">
    import { onBeforeMount } from 'vue'
    import type { PropType } from 'vue'
    import type { InputNode } from '../../types'
    import Renderer from '../Renderer.vue'

    const props = defineProps({
        field: {
            type: Object as PropType<InputNode>,
            required: true
        }
    })

    onBeforeMount(async () => {
        await props.field.sideEffect?.()
    })
</script>

<template>
    <Renderer :field="field" />
</template>