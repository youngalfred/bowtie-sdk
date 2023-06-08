import { usePortfolio } from '@/store/portfolio'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import GetStarted from '../views/GetStarted.vue'
import { homePagesRecord } from '@/data/pages/home'

type BeforeEnterCb = (store: any) => (to: any, from: any) => string | undefined

const withStore = (cb: BeforeEnterCb) => (to: any, from: any) => {
  const store = storeToRefs(usePortfolio())
  return cb(store)(to, from)
}

const enforceAuthorization =
  (cb: BeforeEnterCb): BeforeEnterCb =>
  store =>
  (to: any, from: any) => {
    const { authorizedToAccessApp } = store

    if (!authorizedToAccessApp) {
      return '/authenticate'
    }

    return cb(store)(to, from)
  }

const enforceHomeSelection = (store: any) => (to: any, from: any) => {
  const { portfolio } = store
  const destination = to.fullPath.substring(1)

  if (Object.keys(homePagesRecord).includes(destination)) {
    const policyType = portfolio.value.find('start.policyType')?.value

    if (!/^home/.test(policyType || '')) {
      return '/'
    }

    const homeType = portfolio.value.find('home.propertyType')?.value

    if (!homeType && destination !== 'applicant-details') {
      return 'applicant-details'
    }
  }
}

const guardAutoPages = (store: any) => (to: any, from: any) => {
  const { portfolio } = store
  const destination = to.fullPath.substring(1)

  if (
    destination === 'auto-summary' &&
    portfolio.value.find('start.policyType')?.value !== 'auto'
  ) {
    return '/'
  }
}

const enforceValidPortfolio = (store: any) => (to: any, from: any) => {
  const { portfolio } = store
  if (!portfolio.value.valid) return '/'
}

const guardAutoCount = (page: 'auto' | 'driver') => (store: any) => (to: any) => {
  const { portfolio } = store
  const { id = '0' } = to?.params || {}

  const sdkCount = portfolio.value.find(`auto.${page}s.count`)?.value || '0'

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
      beforeEnter: withStore(enforceAuthorization(() => () => undefined)),
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
      beforeEnter: withStore(enforceAuthorization(enforceHomeSelection)),
    },
    {
      path: '/property-details',
      name: '2',
      component: () => import('../views/Home2.vue'),
      beforeEnter: withStore(enforceAuthorization(enforceHomeSelection)),
    },
    {
      path: '/policy-details',
      name: '3',
      component: () => import('../views/Home3.vue'),
      beforeEnter: withStore(enforceAuthorization(enforceHomeSelection)),
    },
    {
      path: '/home-summary',
      name: '4',
      component: () => import('../views/Home4.vue'),
      beforeEnter: withStore(enforceAuthorization(enforceHomeSelection)),
    },
    {
      path: '/auto-hub',
      name: 'Auto Hub',
      component: () => import('../views/AutoHub.vue'),
      beforeEnter: withStore(enforceAuthorization(guardAutoPages)),
    },
    {
      path: '/driver/:id',
      name: 'driver',
      component: () => import('../views/AutoSpoke.vue'),
      beforeEnter: withStore(enforceAuthorization(guardAutoCount('driver'))),
    },
    {
      path: '/vehicle/:id',
      name: 'vehicle',
      component: () => import('../views/AutoSpoke.vue'),
      beforeEnter: withStore(enforceAuthorization(guardAutoCount('auto'))),
    },
    {
      path: '/auto-summary',
      name: 'Auto Summary',
      component: () => import('../views/AutoReview.vue'),
      beforeEnter: withStore(enforceAuthorization(guardAutoPages)),
    },
    {
      path: '/submit',
      name: 'Submit',
      component: () => import('../views/Submit.vue'),
      beforeEnter: withStore(enforceValidPortfolio),
    },
  ],
})

export default router
