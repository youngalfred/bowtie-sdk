<script setup lang='ts'>
    import { usePortfolio } from '@/store/portfolio';
    import type {PropType } from 'vue'
    import Renderer from './Renderer.vue'
    import { makeFieldGroups } from '@/modifiers'
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
    const { view, inReview } = storeToRefs(portfoliioStore)
    
</script>

<template >
    <div id='wrapper'>
    <Renderer
        v-for='field of makeFieldGroups(
            view(section),
            portfoliioStore,
            inReview
        )'
        :key='field.id'
        :field='field' />
    </div>
</template>

<style scoped>
    #wrapper {
        margin-bottom: 150px;
        padding: 2rem;
    }
</style>