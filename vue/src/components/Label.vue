<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { Field, Node } from '@/types'

const props = defineProps({
  field: {
    type: Object as PropType<Node>,
    required: true,
  },
})
const { decoration = '' } = props.field as Field
const decorationPath = ref(decoration)

const handleDevAssetImport = () => {
  // I'm confident there's a vite options for this, but I couldn't find it quickly, so...
  // the image decorations don't work when running 'npm run dev'
  // without this error handler that updates the <img/> src attribute
  decorationPath.value = `src/assets/${decorationPath.value}`
}

const handleClick = () => {
  switch (props.field.kind) {
    case 'check':
      props.field.onChange(props.field.value === '1' ? '' : '1')
      break
    case 'radio':
      props.field.onChange(props.field.option.name)
    default:
      return
  }
}
</script>

<template>
  <img v-if="decoration" :src="decorationPath" @click="handleClick" @error="handleDevAssetImport" />
  <h3 v-html="field.label" @click="handleClick" />
</template>

<style scoped>
h3 {
  margin-top: 1em;
  align-self: center;
}
img {
  margin-top: 1em !important;
  max-height: 5em;
  max-width: 8em;
  width: auto;
  display: block;
  margin: 0 auto;
}
</style>
