<script setup lang="ts">
    import type { PropType } from 'vue'
    import Label from './Label.vue'
    import type { Node } from '../types'
    import { TYPE_HANDLERS } from './fieldgroups/handlers'

    const props = defineProps({
        field: {
            type: Object as PropType<Node>,
            required: true
        }
    })

    const Component = TYPE_HANDLERS[props.field.kind]
</script>

<template>
    <Label :field="field" />
    <Component :field="field"/>
</template>