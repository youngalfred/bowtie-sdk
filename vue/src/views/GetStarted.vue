<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import PolicySection from '@/components/PolicySection.vue'
import { usePortfolio } from '@/store/portfolio'
import type { FieldType } from '@youngalfred/bowtie-sdk'
import { storeToRefs } from 'pinia'

const { app, request } = storeToRefs(usePortfolio())
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

const isIncomplete = ([_id, f]: [id: string, f: FieldType | undefined]) => !f?.valid.valid
const requiredFields = [
  'start.policyType',
  'start.firstName',
  'start.lastName',
  'start.emailAddress',
  'start.address.streetAddress',
  'start.address.city',
  'start.address.state',
  'start.address.zipCode',
]
</script>

<template>
  <PolicySection section="get-started" />
  <NavBar
    :buttons="[
      {
        label: 'Next',
        path: `${makeNextPath(app.find('start.policyType')?.value)}`,
        disabled: Object.entries(request(requiredFields)).some(isIncomplete),
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
