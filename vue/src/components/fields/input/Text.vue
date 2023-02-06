<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import type { Field } from '../../../types'

const props = defineProps({
  field: {
    type: Object as PropType<Field>,
    required: true,
  },
})

// I tried many other approaches with @change & @keypress,
// but none are as effective as this solution that
// uses computed with v-model.
const value = computed({
  get: () => props.field.value,
  set: value => props.field.onChange(value),
})
</script>

<template>
  <input
    :id="field.id"
    :class="field.classes"
    :placeholder="field.placeholder"
    :data-automation-id="field.id"
    v-model="value"
    type="text"
  />
</template>
