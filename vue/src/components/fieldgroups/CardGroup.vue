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
  border: 1px solid black;
  border-radius: 4px;
  padding: 5px;
}
</style>
