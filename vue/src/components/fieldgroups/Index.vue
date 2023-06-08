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
  <div class="question fg" :id="field.id" v-for="child of field.children" :key="child.id">
    <Renderer :field="child" />
  </div>
</template>

<style>
  .fg {
    padding-left: 0.5rem;
    margin-left: 1.5rem;
  }
</style>