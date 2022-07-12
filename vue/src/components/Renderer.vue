<script setup lang="ts">
    import type { PropType } from 'vue'
    import Label from './Label.vue'
    import type { Node } from '../types'
    import { ID_HANDLERS, TYPE_HANDLERS } from './fieldgroups/handlers'
    import Warning from './Warning.vue'

    const props = defineProps({
        field: {
            type: Object as PropType<Node>,
            required: true
        }
    })

    const Component = (
        ID_HANDLERS[props.field.id.replace(/-[0-9]+/g, '-n')]
        || TYPE_HANDLERS[props.field.kind]
    )
</script>

<template>
    <div class='wrapper'>
        <Label :field="field" />
        <Warning :field="field" />
        <Component :field="field"/>
    </div>
</template>

<style>
    .wrapper {
        padding-left: 1.5em;
    }
</style>