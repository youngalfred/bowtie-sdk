<script setup lang="ts">
import type { PropType } from 'vue'
import type { Node } from '../types'

defineProps({
  field: {
    type: Object as PropType<Node>,
    required: true,
  },
})
</script>

<template>
  <span v-if="!!field.warning" class="warning">
    {{ field.warning }}
  </span>
</template>

<style scoped>
span {
  display: block;
  color: red;
}
</style>
