<script setup lang="ts">
  import { usePortfolio } from '@/store/portfolio';
  import { storeToRefs } from 'pinia';
  import HubController from '../components/fieldgroups/HubController.vue'

  const portfolio = usePortfolio()
  const { countOf } = storeToRefs(portfolio)
  
  const makeAutoLink = (basePath: 'driver'|'vehicle', label: string) => (count: number) => {
    if (count < 0) return []

    const pathToLinkRecord = Array.from(Array(count))
      .reduce((acc, _, idx) => ({
        ...acc,
        [`/${basePath}/${idx + 1}`]: `${label} ${idx+1}`
      }), {})

      return Object.entries(pathToLinkRecord)
  }

  const makeVehicleLink = makeAutoLink('vehicle', 'Vehicle')
  const makeDriverLink = makeAutoLink('driver', 'Driver')
</script>

<template>
  <HubController
    :add-entity="() => portfolio.addAutoEntity('driver')"
    :remove-entity="(id) => portfolio.removeAutoEntity('driver', id)"
    :make-path-label-pair="() => makeDriverLink(countOf('drivers'))" />
    <br/>
  <HubController
    :add-entity="() => portfolio.addAutoEntity('auto')"
    :remove-entity="(id) => portfolio.removeAutoEntity('auto', id)"
    :make-path-label-pair="() => makeVehicleLink(countOf('autos'))"/>
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
