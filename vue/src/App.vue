<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePortfolio } from './store/portfolio'
import router from './router'

const store = usePortfolio()
const { app, checkingForStoredApplication } = storeToRefs(store)

const getSubRoutes = (): [string, string][][] => {
  const driversCount = parseInt(app.value.find('auto.drivers.count')?.value || '0', 10)
  const vehiclesCount = parseInt(app.value.find('auto.autos.count')?.value || '0', 10)
  const policyType = app.value.find('start.policyType')?.value

  let routes: Record<string, string>[] = []
  switch (policyType) {
    case 'home':
      break
    case 'homeAndAuto':
    case 'auto':
      routes = [
        Array.from(Array(driversCount)).reduce(
          (acc, _, idx) => ({ ...acc, [`/driver/${idx + 1}`]: `Driver ${idx + 1}` }),
          {},
        ),
        Array.from(Array(vehiclesCount)).reduce(
          (acc, _, idx) => ({ ...acc, [`/vehicle/${idx + 1}`]: `Vehicle ${idx + 1}` }),
          {},
        ),
      ]
      break
    default:
  }

  return routes.map(r => Object.entries(r))
}

const getMainRoutes = (): [string, string][] => {
  const policyType = app.value.find('start.policyType')?.value
  const homeType = app.value.find('home.propertyType')?.value

  const home = {
    '/applicant-details': 'Policy Holder(s)',
    ...(homeType
      ? {
          '/property-details': 'The Property',
          '/policy-details': 'The Policy',
          '/home-summary': 'Home Summary',
        }
      : {}),
  }

  const auto = {
    '/auto-hub': 'Auto Hub',
    '/auto-summary': 'Summary',
  }

  let routes = {}
  switch (policyType) {
    case 'home':
      routes = home
      break
    case 'homeAndAuto':
      routes = {
        ...home,
        ...auto,
      }
      break
    case 'auto':
      routes = auto
      break
    default:
  }

  return Object.entries(routes)
}

onMounted(async () => {
  await store.initPortfolio()
  if (!store.authorizedToAccessApp) {
    router.replace('/authenticate')
  }
})

</script>

<template>
  <header>
    <img alt="Young Alfred logo" class="logo" src="@/assets/logo.png" />

    <nav>
      <RouterLink to="/">Get Started</RouterLink>
      <RouterLink v-for="[path, label] of getMainRoutes()" :to="path">{{ label }}</RouterLink>
      <div v-for="routeList of getSubRoutes()">
        <RouterLink v-for="[path, label] of routeList" :to="path">{{ label }}</RouterLink>
      </div>
    </nav>
  </header>

  <div v-if='checkingForStoredApplication'>
    ...Checking for a stored application to resume...
  </div>
  <RouterView v-else />
</template>

<style lang="scss">
@import '@/assets/base.css';
@import '@/windmit.scss';

#app {
  width: 100%;
  font-weight: normal;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 1rem auto;
}

nav a.router-link-exact-active,
.green {
  text-decoration: none;
  color: #014452;
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

a {
  text-decoration: none;
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
