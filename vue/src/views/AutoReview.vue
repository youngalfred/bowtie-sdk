<script setup lang="ts">
  import PolicySection from '@/components/PolicySection.vue';
import NavBar from '../components/NavBar.vue';
 
</script>

<template>
  <PolicySection section='auto-summary' />
  <NavBar :buttons="[
    {
      label: 'Back',
      path: '/auto-hub',
      disabled: false
    },
    {
      label: 'Submit',
      path: '/submit',
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
