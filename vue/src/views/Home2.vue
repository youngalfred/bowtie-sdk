<script setup lang="ts">
  import PolicySection from '@/components/PolicySection.vue';
import NavBar from '../components/NavBar.vue';
 
</script>

<template>
  <PolicySection section='property-details' />
  <NavBar :buttons="[
    {
      label: 'Back',
      path: '/applicant-details',
      disabled: false
    },
    {
      label: 'Review & Submit',
      path: '/policy-details',
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
