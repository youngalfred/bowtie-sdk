<script setup lang="ts">
  import PolicySection from '@/components/PolicySection.vue';
  import { usePortfolio } from '@/store/portfolio';
  import { storeToRefs } from 'pinia';
  import NavBar from '../components/NavBar.vue';
  import type { SDKField, SDKInputField } from '@/types';
  import type { ButtonAction } from '@/types/props'

  const { app, request } = storeToRefs(usePortfolio())

  const makeNextButton = (valid: boolean, {'start.policyType': policyType }: Record<string, SDKField>) => {

    const { value } = policyType as SDKInputField
    switch (value) {
      case 'home':
        return {
          label: 'Submit',
          path: '/submit',
          disabled: !valid
        }
      case 'homeAndAuto': {
        return {
          label: 'Start Auto',
          path: '/submit',
          disabled: !valid
        }
      }
      default:
        return null
    }
  }
</script>

<template>
  <PolicySection section='home-summary' />
  <NavBar :buttons="([
      {
        label: 'Back',
        path: '/policy-details',
        disabled: false
      },
      makeNextButton(app.valid, request(['start.policyType']))
      
    ].filter(b => b) as ButtonAction[])"/>
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
