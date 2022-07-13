<script setup lang='ts'>
  import PolicySection from '@/components/PolicySection.vue';
  import NavBar from '../components/NavBar.vue';

</script>

<template>
  <PolicySection section='policy-details' />
  <NavBar :buttons="[
    {
      label: 'Back',
      path: '/property-details',
      disabled: false
    },
    {
      label: 'Next',
      path: '/home-summary',
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
