<script setup lang="ts">
import { onBeforeMount, watch } from 'vue'
import type { PropType } from 'vue'
import type { InputNode } from '../../types'
import Renderer from '../Renderer.vue'

const props = defineProps({
  field: {
    type: Object as PropType<InputNode>,
    required: true,
  },
})

watch(
  () => props.field.value,
  async (updated, previous) => {
    if (updated !== previous) {
      await props.field.sideEffect?.(false)
    }
  },
)

onBeforeMount(async () => {
  await props.field.sideEffect?.(true)
})
</script>

<template>
  <Renderer :field="field" :render-by-kind-only="true" />
</template>
