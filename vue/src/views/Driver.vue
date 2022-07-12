<script setup lang="ts">
    import PolicySection from '@/components/PolicySection.vue';
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
 
    const route = useRoute();

    const cleanId = (...ids: any[]) => {
      const [id = '0'] = ids
      return id.replace(/[^0-9]/g, '') || '0'
    }
</script>

<template>
  <PolicySection :section="`driver-${cleanId(route.params?.id)}`" />
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
