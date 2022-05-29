<script setup lang="ts">
    import { usePortfolio } from '@/store/portfolio';
    import type {PropType } from 'vue'
    import Renderer from './Renderer.vue'
    import { makeFieldGroups } from './fieldgroups/field-builder'
    import type { HomeSection } from '@/data/pages/home'
    import { storeToRefs } from 'pinia';
    import type { AutoSection } from '@/data/pages/auto';

    const { section } = defineProps({
        section: {
            type: String as PropType<HomeSection|AutoSection>,
            required: true
        }
    })

    const portfoliioStore = usePortfolio()
    const { view } = storeToRefs(portfoliioStore)
    
</script>

<template >
    <div>
    <Renderer
        v-for="field of makeFieldGroups(
            view(section),
            portfoliioStore.updateField
        )"
        :key="field.id"
        :field="field" />
    </div>
</template>