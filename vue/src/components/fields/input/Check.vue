
<script setup lang='ts'>
    import type { PropType } from 'vue'
    import type { Field } from '../../../types'
    import { onCheck } from '@/utils/change-event';
import { computed } from '@vue/reactivity';

    const props = defineProps({
        field: {
            type: Object as PropType<Field>,
            required: true
        }
    })

    const checked = computed({ 
      get: () => props.field.value === '1', 
      set: (value) => props.field.onChange(value ? '1' : '')
    })

</script>

<template>
    <input
        type='checkbox'
        v-model="checked"
    />
</template>
