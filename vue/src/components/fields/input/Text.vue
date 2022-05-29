<script setup lang="ts">
    import type { PropType } from 'vue'
import { onChange } from '../../../../../angular/src/utilities';
    import type { Field } from '../../../types'

    defineProps({
        field: {
            type: Object as PropType<Field>,
            required: true
        }
    })

</script>

<template>
    <input :id="field.id" :class="field.classes" :data-automation-id="field.id"
        v-model="field.value" type='text' @change="onChange($event, field.onChange)">
</template>