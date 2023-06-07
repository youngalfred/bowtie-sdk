<script setup lang="ts">
import type { PropType } from 'vue'
import type { Fieldgroup } from '../../types'
import Renderer from '../Renderer.vue'

defineProps({
  field: {
    type: Object as PropType<Fieldgroup>,
    required: true,
  },
})
</script>

<template>
  <Renderer :field="field" :render-by-kind-only="true" :with-label="true" />
</template>

<style scoped>
div {
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border-radius: 4px;
  padding: 5px;
}
</style>
