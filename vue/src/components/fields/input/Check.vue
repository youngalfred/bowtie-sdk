
<script setup lang="ts">
    import type { PropType } from 'vue'
    import type { Field } from '../../../types'
    import { onCheck } from '@/utils/change-event';

    defineProps({
        field: {
            type: Object as PropType<Field>,
            required: true
        }
    })

</script>

<template>
    <input
        type="checkbox"
        @change="onCheck($event, field.onChange)"
        :checked="field.value === '1'"
    />
</template>
