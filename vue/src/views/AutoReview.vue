<script setup lang='ts'>
  import PolicySection from '@/components/PolicySection.vue';
  import { usePortfolio } from '@/store/portfolio';
  import type { SDKField, SDKInputField } from '@/types';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import NavBar from '../components/NavBar.vue';
  import type { ButtonAction } from '@/types/props'
  
  const route = useRoute()
  const portfolio = usePortfolio()
  const { app, inReview, request } = storeToRefs(portfolio)

  const makeNextButton = (valid: boolean, inReview: boolean, {'start.policyType': policyType }: Record<string, SDKField>): ButtonAction|null => {

    if (!valid) {
      return {
        label: 'Highlight Invalid',
        path: route.path,
        onClick: () => portfolio.setInReview(true),
        disabled: inReview
      }
    }

    const { value } = policyType as SDKInputField
    switch (value) {
      case 'auto':
        return {
          label: 'Submit',
          path: '/submit',
          disabled: false
        }
      case 'homeAndAuto':
        return {
          label: 'Submit Home & Auto',
          path: '/submit',
          disabled: false
        }
      default:
        return null
    }
  }
</script>

<template>
  <PolicySection section='auto-summary' />
  <NavBar :buttons="([
    {
      label: 'Back',
      path: '/auto-hub',
      disabled: false
    },
    makeNextButton(app.valid, inReview, request(['start.policyType']))
      
    ].filter(b => b) as ButtonAction[])" />
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
