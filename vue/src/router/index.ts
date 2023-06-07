import { usePortfolio } from '@/store/portfolio'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import GetStarted from '../views/GetStarted.vue'
import { homePagesRecord } from '@/data/pages/home'

type BeforeEnterCb = (to: any, from: any) => string|undefined

const enforceAuthorization = (cb: BeforeEnterCb) => (to: any, from: any) => {
  const portfolio = usePortfolio()
  const { authorizedToAccessApp } = storeToRefs(portfolio)

  if (!authorizedToAccessApp) {
    return '/authenticate'
  }

  return cb(to, from)
}

const enforceHomeSelection = (to: any, from: any) => {
  const portfolio = usePortfolio()
  const { app } = storeToRefs(portfolio)
  const destination = to.fullPath.substring(1)

  if (Object.keys(homePagesRecord).includes(destination)) {
    const policyType = app.value.find('start.policyType')?.value

    if (!/^home/.test(policyType || '')) {
      return '/'
    }

    const homeType = app.value.find('home.propertyType')?.value

    if (!homeType && destination !== 'applicant-details') {
      return 'applicant-details'
    }
  }
}

const guardAutoPages = (to: any, from: any) => {
  const portfolio = usePortfolio()
  const { app } = storeToRefs(portfolio)
  const destination = to.fullPath.substring(1)

  if (destination === 'auto-summary' && app.value.find('start.policyType')?.value !== 'auto') {
    return '/'
  }
}

const enforceValidPortfolio = (to: any, from: any) => {
  const portfolio = usePortfolio()
  const { app } = storeToRefs(portfolio)

  if (!app.value.valid) return '/'
}

const guardAutoCount = (page: 'auto' | 'driver') => (to: any) => {
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
      beforeEnter: enforceAuthorization(() => undefined)
    },
    {
      path: '/authenticate',
      name: 'authenticate',
      component: () => import('../views/Authenticate.vue'),
    },
    {
      path: '/applicant-details',
      name: 'applicant-details',
      component: () => import('../views/Home1.vue'),
      beforeEnter: enforceAuthorization(enforceHomeSelection),
    },
    {
      path: '/property-details',
      name: '2',
      component: () => import('../views/Home2.vue'),
      beforeEnter: enforceAuthorization(enforceHomeSelection),
    },
    {
      path: '/policy-details',
      name: '3',
      component: () => import('../views/Home3.vue'),
      beforeEnter: enforceAuthorization(enforceHomeSelection),
    },
    {
      path: '/home-summary',
      name: '4',
      component: () => import('../views/Home4.vue'),
      beforeEnter: enforceAuthorization(enforceHomeSelection),
    },
    {
      path: '/auto-hub',
      name: 'Auto Hub',
      component: () => import('../views/AutoHub.vue'),
      beforeEnter: enforceAuthorization(guardAutoPages),
    },
    {
      path: '/driver/:id',
      name: 'driver',
      component: () => import('../views/AutoSpoke.vue'),
      beforeEnter: enforceAuthorization(guardAutoCount('driver')),
    },
    {
      path: '/vehicle/:id',
      name: 'vehicle',
      component: () => import('../views/AutoSpoke.vue'),
      beforeEnter: enforceAuthorization(guardAutoCount('auto')),
    },
    {
      path: '/auto-summary',
      name: 'Auto Summary',
      component: () => import('../views/AutoReview.vue'),
      beforeEnter: enforceAuthorization(guardAutoPages),
    },
    {
      path: '/submit',
      name: 'Submit',
      component: () => import('../views/Submit.vue'),
      beforeEnter: enforceValidPortfolio,
    },
  ],
})

export default router
