<script setup lang='ts'>
  import PolicySection from '@/components/PolicySection.vue';
  import { usePortfolio } from '@/store/portfolio';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import NavBar from '../components/NavBar.vue';
  
  const route = useRoute()
  const portfolio = usePortfolio()
  const { app } = storeToRefs(portfolio)
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
    },
    ...app.valid ? [{
        label: 'Highlight Invalid',
        path: route.path,
        onClick: () => portfolio.setInReview(true),
        disabled: app.valid
    }] : []
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
