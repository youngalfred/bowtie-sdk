
<script setup lang="ts">
    import type { PropType } from 'vue'
    import type { Radio } from '@/types'

    defineProps({
        field: {
            type: Object as PropType<Radio>,
            required: true
        }
    })

</script>

<template>
    <input
        type="radio"
        @change="field.onChange(field.option.name)"
        :checked="field.value === field.option.name"
    />
</template>
