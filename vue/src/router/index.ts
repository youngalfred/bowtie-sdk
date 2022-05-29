import { usePortfolio } from '@/store/portfolio'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import GetStarted from '../views/GetStarted.vue'
import { homePagesRecord } from '@/data/pages/home'

const enforceHomeSelection = (to: any, from: any) => {
      const portfolio = usePortfolio()
      const { app } = storeToRefs(portfolio)
      const destination = to.fullPath.substring(1)
  
      if (Object.keys(homePagesRecord).includes(destination)) {
        const policyType = app.value.find('start.policyType')?.value
        
        console.log({policyType})
        if (policyType !== 'home') {
          return '/'
        }
        
        const homeType = app.value.find('home.propertyType')?.value
        console.log({homeType})
        if (!homeType && destination !== 'applicant-details') {
          return 'applicant-details'
        }

      }
}

const guardAutoRPages = (to: any, from: any) => {
  const portfolio = usePortfolio()
  const { app } = storeToRefs(portfolio)
  const destination = to.fullPath.substring(1)

    if ((
      destination === 'auto-summary'
      && app.value.find('start.policyType')?.value !== 'auto'
    )) {
      return '/'
    }
}

const guardAutoCount = (page: 'auto'|'driver') => (to: any) => {
  const portfolio = usePortfolio()
  const { app } = storeToRefs(portfolio)
  const { id = '0' } = to?.params || {}

  const sdkCount = app.value.find(`auto.${page}s.count`)?.value || '0'

  const count = parseInt(sdkCount.replace(/[^0-9]/g, ''), 10)
  const requestedPage = parseInt(id.replace(/[^0-9]/g, ''), 10)

  if (requestedPage > count || count === 0) {
    return '/'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GetStarted,
      beforeEnter: enforceHomeSelection
    },
    {
      path: '/applicant-details',
      name: 'applicant-details',
      component: () => import('../views/Home1.vue'),
      beforeEnter: enforceHomeSelection
    },
    {
      path: '/property-details',
      name: '2',
      component: () => import('../views/Home2.vue'),
      beforeEnter: enforceHomeSelection
    },
    {
      path: '/policy-details',
      name: '3',
      component: () => import('../views/Home3.vue'),
      beforeEnter: enforceHomeSelection
    },
    {
      path: '/auto-hub',
      name: 'Auto Hub',
      component: () => import('../views/AutoHub.vue'),
      beforeEnter: guardAutoRPages,
    },
    {
      path: '/driver/:id',
      name: 'driver',
      component: () => import('../views/Driver.vue'),
      beforeEnter: guardAutoCount('driver'),
    },
    {
      path: '/vehicle/:id',
      name: 'Vehicle',
      component: () => import('../views/Vehicle.vue'),
      beforeEnter: guardAutoCount('auto'),
    },
    {
      path: '/auto-summary',
      name: 'Auto Summary',
      component: () => import('../views/AutoReview.vue'),
      beforeEnter: guardAutoRPages,
    }
  ]
})

export default router
