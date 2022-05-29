<script setup lang="ts">
    import PolicySection from '@/components/PolicySection.vue';
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';
 
    const route = useRoute();

    // const params = computed(() => route.params)
    // watch(() => route.name, () => {
    //   console.debug(`MyCoolComponent - watch route.name changed to ${route.name}`);
    //   // Do something here...

    //   // Optionally you can set immediate: true config for the watcher to run on init
    // //}, { immediate: true });
    // });
    // console.log({id: params.id})
    // const driverId = parseInt(params.id || '0', 10)
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
