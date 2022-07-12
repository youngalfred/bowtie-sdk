<script setup lang="ts">
    import PolicySection from '@/components/PolicySection.vue';
    import { useRoute } from 'vue-router';
import NavBar from '../components/NavBar.vue';
 
    const route = useRoute();

    const cleanId = (...ids: any[]) => {
      const [id = '0'] = ids
      return id.replace(/[^0-9]/g, '') || '0'
    }
</script>

<template>
  <PolicySection :section="`vehicle-${cleanId(route.params?.id)}`" />
  <NavBar :buttons="[
    {
      label: 'Go To Auto Hub',
      path: '/auto-hub',
      disabled: false,
    }
  ]"/>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
