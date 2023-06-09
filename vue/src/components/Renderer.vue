<script setup lang="ts">
import type { PropType } from 'vue'
import Label from './Label.vue'
import type { CustomRenderer, Node, CustomRendererHandler, TypeHandler } from '../types'
import { CUSTOM_RENDERER_HANDLERS, TYPE_HANDLERS } from './fieldgroups/handlers'

const props = defineProps({
  field: {
    type: Object as PropType<Node>,
    required: true,
  },
  renderByKindOnly: {
    type: Boolean,
  },
  withLabel: {
    type: Boolean,
  },
  typeHandlers: {
    type: Object as PropType<TypeHandler>,
  },
  customHandlers: {
    type: Object as PropType<CustomRendererHandler>,
  },
})

const { customHandlers = CUSTOM_RENDERER_HANDLERS, typeHandlers = TYPE_HANDLERS } = props

const Component = props.renderByKindOnly
  ? typeHandlers[props.field.kind]
  : customHandlers[props.field.renderer || ('' as CustomRenderer)] || typeHandlers[props.field.kind]
</script>

<template>
  <div class="wrapper" :id="field.id">
    <template v-if="field.renderer !== 'card' || withLabel">
      <Label :field="field" />
    </template>
    <Component :field="field" />
  </div>
</template>

<style>
/* .wrapper {
        padding-left: 1.5em;
    } */
</style>
