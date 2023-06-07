<script setup lang="ts">
import Multiselect from '@vueform/multiselect'
import { computed } from '@vue/reactivity'
import type { PropType } from 'vue'
import type { Select } from '../../../types'

const props = defineProps({
  field: {
    type: Object as PropType<Select>,
    required: true,
  },
})

const toSdk = (values: string[]): void => {
  const value = JSON.stringify(
    values.reduce(
      (acc, value) => ({
        ...acc,
        [props.field.options.find(({ name }) => value === name)?.label || '']: value,
      }),
      {} as Record<string, string>,
    ),
  )

  props.field.onChange(value)
}

const fromSdk = (): string[] => Object.values(JSON.parse(props.field.value || '{}'))

const value = computed<string[]>({
  get: fromSdk,
  set: toSdk,
})

const options = computed(() =>
  props.field.options.map(({ name, label }) => ({ value: name, label })),
)
</script>

<template>
  <Multiselect
    v-model="value"
    mode="tags"
    :close-on-select="false"
    :options="options"
    class="multiselect-green"
  />
</template>

<style src="@vueform/multiselect/themes/default.css">
.multiselect-tag {
  background-color: #014452 !important;
  background: #014452 !important;
}
</style>
