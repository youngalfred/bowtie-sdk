import { defineProps, type PropType } from "vue"
import type { Select, Node } from './index'

export const defineFieldProps = <Node>() => defineProps({
    field: {
        type: Object as PropType<Node>,
        required: true
    }
})