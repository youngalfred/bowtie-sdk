<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import { storeToRefs } from 'pinia';
  import { usePortfolio } from './store/portfolio';

  const { app } = storeToRefs(usePortfolio())

  const getRoutes = () => {
    const policyType = app.value.find('start.policyType')?.value
    const homeType = app.value.find('home.propertyType')?.value
    const driversCount = parseInt(app.value.find('auto.drivers.count')?.value || '0', 10)
    const vehiclesCount = parseInt(app.value.find('auto.autos.count')?.value || '0', 10)

    const home = {
      '/applicant-details': 'Policy Holder(s)',
        ...homeType ? {
          '/property-details': 'The Property',
          '/policy-details': 'The Policy',
        } : {}
    }

    const auto = {
      '/auto-hub': 'Auto Hub',
      ...Array.from(Array(driversCount)).reduce((acc, _, idx) => ({ ...acc, [`/driver/${idx + 1}`]: `Driver ${idx+1}` }), {}),
      ...Array.from(Array(vehiclesCount)).reduce((acc, _, idx) => ({ ...acc, [`/vehicle/${idx + 1}`]: `Vehicle ${idx+1}` }), {}),
      '/auto-summary': 'Summary'
    }

    let routes = {}
    switch (policyType) {
      case 'home':
        routes = home
        break;
      case 'homeAndAuto':
        routes = {
          ...home,
          ...auto,
        }
        break;
      case 'auto':
        routes = auto
        break;
      default:
    }

    return Object.entries(routes)
  }
</script>

<template>
  <header>
    <img alt="Young Alfred logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/">Get Started</RouterLink>
        <RouterLink v-for="[path, label] of getRoutes()" :to="path">{{label}}</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style>
@import '@/assets/base.css';

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
  margin: 0 auto 2rem;
}

nav a.router-link-exact-active,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
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
