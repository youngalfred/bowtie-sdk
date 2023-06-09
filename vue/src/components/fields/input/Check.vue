<script setup lang="ts">
import type { PropType } from 'vue'
import type { Field } from '../../../types'
import { computed } from '@vue/reactivity'
import Warning from '@/components/Warning.vue'

const props = defineProps({
  field: {
    type: Object as PropType<Field>,
    required: true,
  },
})

const checked = computed({
  get: () => props.field.value === '1',
  set: value => props.field.onChange(value ? '1' : ''),
})
</script>

<template>
  <input type="checkbox" v-model="checked" />
  <Warning :field="field" />
</template>
