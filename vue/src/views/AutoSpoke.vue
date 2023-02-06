<script setup lang="ts">
import PolicySection from '@/components/PolicySection.vue'
import NavBar from '../components/NavBar.vue'
import type { AutoSection } from '@/data/pages/auto'
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'

const route = useRoute()

const getSection = ({ name, params }: RouteLocationNormalizedLoaded): AutoSection => {
  const cleanId = (...ids: any[]) => {
    const [id = '0'] = ids
    return id.replace(/[^0-9]/g, '') || '0'
  }

  return `${name?.toString() as 'driver' | 'vehicle'}-${cleanId(params?.id)}`
}
</script>

<template>
  <PolicySection :section="`${getSection(route)}`" />
  <NavBar
    :buttons="[
      {
        label: 'Go To Auto Hub',
        path: '/auto-hub',
        disabled: false,
      },
    ]"
  />
</template>
