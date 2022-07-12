<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue';
  import PolicySection from '@/components/PolicySection.vue';
  import { usePortfolio } from '@/store/portfolio';
  import { storeToRefs } from 'pinia';

  const { app } = storeToRefs(usePortfolio())
  const makeNextPath = (policyType = '') => {
    switch (policyType) {
      case 'homeAndAuto':
      case 'home':
        return '/applicant-details'
      case 'auto':
        return '/driver/1'
      default:
        return '/'
    }
  }
</script>

<template>
  <PolicySection section='get-started' />
  <NavBar :buttons="[
    {
      label: 'Next',
      path: `${makeNextPath(app.find('start.policyType')?.value)}`,
      disabled: false
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
