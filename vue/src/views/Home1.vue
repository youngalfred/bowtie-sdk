<script setup lang="ts">
import PolicySection from '@/components/PolicySection.vue'
import { usePortfolio } from '@/store/portfolio'
import { storeToRefs } from 'pinia'
import NavBar from '../components/NavBar.vue'

const { assertFieldEquals } = storeToRefs(usePortfolio())
</script>

<template>
  <PolicySection section="applicant-details" />
  <NavBar
    :buttons="[
      {
        label: 'Start Over',
        path: '/',
        disabled: false,
      },
      {
        label: 'Next',
        path: '/property-details',
        disabled: assertFieldEquals('home.propertyType', ''),
      },
    ]"
  />
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
