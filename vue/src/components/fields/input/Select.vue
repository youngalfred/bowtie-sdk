<script setup lang="ts">
import { computed } from '@vue/reactivity'
import type { PropType } from 'vue'
import type { Select } from '../../../types'

const props = defineProps({
  field: {
    type: Object as PropType<Select>,
    required: true,
  },
})

const value = computed({
  get: () => props.field.value,
  set: value => props.field.onChange(value),
})
</script>

<template>
  <select v-model="value">
    <option v-for="o of field.options" :value="o.name">{{ o.label }}</option>
  </select>
</template>
