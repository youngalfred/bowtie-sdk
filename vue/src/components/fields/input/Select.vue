<script setup lang="ts">
    import { onChange } from '@/utils/change-event';
import type { PropType } from 'vue'
    import type { Select } from '../../../types'
    
    defineProps({
        field: {
            type: Object as PropType<Select>,
            required: true
        }
    })
    
</script>

<template>
    <select @change="onChange($event, field.onChange)" v-model="field.value">
        <option v-for="o of field.options" :value="o.name">{{o.label}}</option>
    </select>
</template>