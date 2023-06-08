<script setup lang="ts">
import { usePortfolio } from '@/store/portfolio'
import { storeToRefs } from 'pinia'
import HubController from '../components/fieldgroups/HubController.vue'
import NavBar from '../components/NavBar.vue'

const store = usePortfolio()
const { countOf } = storeToRefs(store)

const makeAutoLink =
  (basePath: 'driver' | 'vehicle', label: string) =>
  (count: number): [string, string][] => {
    if (count < 0) return []

    const pathToLinkRecord = Array.from(Array(count)).reduce(
      (acc, _, idx) => ({
        ...acc,
        [`/${basePath}/${idx + 1}`]: `${label} ${idx + 1}`,
      }),
      {},
    )

    return Object.entries(pathToLinkRecord)
  }

const makeVehicleLink = makeAutoLink('vehicle', 'Vehicle')
const makeDriverLink = makeAutoLink('driver', 'Driver')
</script>

<template>
  <HubController
    :add-entity="() => store.addAutoEntity('driver')"
    :remove-entity="id => store.removeAutoEntity('driver', id)"
    :make-path-label-pair="() => makeDriverLink(countOf('drivers'))"
  />
  <br />
  <HubController
    :add-entity="() => store.addAutoEntity('auto')"
    :remove-entity="id => store.removeAutoEntity('auto', id)"
    :make-path-label-pair="() => makeVehicleLink(countOf('autos'))"
  />

  <NavBar
    :buttons="[
      {
        label: 'Start Over',
        path: '/',
        disabled: false,
      },
      {
        label: 'Review & Submit',
        path: '/auto-summary',
        disabled: false,
      },
    ]"
  />
</template>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
