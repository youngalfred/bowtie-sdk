<script setup lang="ts">
  import PolicySection from '@/components/PolicySection.vue';
import { usePortfolio } from '@/store/portfolio';
import { storeToRefs } from 'pinia';
import NavBar from '../components/NavBar.vue';
  const { app } = storeToRefs(usePortfolio())
</script>

<template>
  <PolicySection section='policy-details' />
  <NavBar :buttons="[
    {
      label: 'Back',
      path: '/policy-details',
      disabled: false
    },
    {
      label: 'Submit',
      path: '/submit',
      disabled: !app.valid
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
