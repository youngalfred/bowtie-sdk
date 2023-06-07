<script setup lang="ts">
import { usePortfolio } from '@/store/portfolio'
import { onMounted, reactive } from 'vue'
import NavBar from '../components/NavBar.vue'
import getPortfolioStatus from '@/api/portfolio-status'

const portfolio = usePortfolio()

const data = reactive({
  isSubmitting: true,
  isSuccess: false,
  portfolioId: null as string | null,
  portfolioStatus: {},
})

onMounted(async () => {
  let succeeded = false
  try {
    const { portfolioId = '', message } = await portfolio.submit()
    data.portfolioId = portfolioId
    succeeded = true
  } catch (err) {
    console.error(err)
  } finally {
    data.isSubmitting = false
    data.isSuccess = succeeded
    if (succeeded) {
      portfolio.resetApplication()
    }
  }
})

const startOver = () => window.location.reload()
</script>

<template>
  <div>
    <h2>
      {{ data.isSubmitting ? '...Submitting' : data.isSuccess ? 'Success' : 'Failed Submission' }}
    </h2>
    <div>
      {{ JSON.stringify(data.portfolioStatus) }}
    </div>
  </div>
  <NavBar
    :buttons="[
      {
        label: 'Submit Another',
        path: '/',
        onClick: startOver,
        disabled: false,
      },
      ...(data.isSuccess
        ? [
            {
              label: 'Get Portfolio Status',
              path: '/submit',
              onClick: async () => {
                if (data.portfolioId) {
                  data.portfolioStatus = await getPortfolioStatus(data.portfolioId)
                }
              },
              disabled: false,
            },
          ]
        : []),
    ]"
  />
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
