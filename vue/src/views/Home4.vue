<script setup lang="ts">
import PolicySection from '@/components/PolicySection.vue'
import { usePortfolio } from '@/store/portfolio'
import { storeToRefs } from 'pinia'
import NavBar from '../components/NavBar.vue'
import type { SDKField, SDKInputField } from '@/types'
import type { ButtonAction } from '@/types/props'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = usePortfolio()
const { portfolio, request, inReview } = storeToRefs(store)

const makeNextButton = (
  valid: boolean,
  inReview: boolean,
  { 'start.policyType': policyType }: Record<string, SDKField>,
): ButtonAction | null => {
  if (!valid) {
    return {
      label: inReview ? 'Hide Invalid Highlighting' : 'Highlight Invalid',
      path: route.path,
      onClick: () => store.setInReview(!inReview),
      disabled: false,
    }
  }

  const { value } = policyType as SDKInputField
  switch (value) {
    case 'home':
      return {
        label: 'Submit',
        path: '/submit',
        disabled: false,
      }
    case 'homeAndAuto':
      return {
        label: 'Start Auto',
        path: '/submit',
        disabled: false,
      }
    default:
      return null
  }
}
</script>

<template>
  <PolicySection section="home-summary" />
  <NavBar
    :buttons="([
      {
        label: 'Back',
        path: '/policy-details',
        disabled: false
      },
      makeNextButton(portfolio.valid, inReview, request(['start.policyType']))
      
    ].filter(b => b) as ButtonAction[])"
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
