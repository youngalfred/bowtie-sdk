import { defineProps, type PropType } from 'vue'

export const defineFieldProps = <Node>() =>
  defineProps({
    field: {
      type: Object as PropType<Node>,
      required: true,
    },
  })

export type ButtonAction = {
  path: string
  onClick?: () => void
  label: string
  disabled: boolean
}
