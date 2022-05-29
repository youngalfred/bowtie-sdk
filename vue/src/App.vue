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
        '/applicant-details': 'The Insuree',
        ...homeType ? {
          '/property-details': 'The Property',
          '/policy-details': 'The Policy',
        } : {}
    }

    let routes = {}
    switch (policyType) {
      case 'home':
        routes = home
      case 'homeAndAuto':
        routes = {
          ...home
        }
        break;
      case 'auto':
        routes = {
          '/auto-hub': 'Auto Hub',
          ...Array.from(Array(driversCount)).reduce((acc, _, idx) => ({ ...acc, [`/driver/${idx + 1}`]: `Driver ${idx+1}` }), {}),
          ...Array.from(Array(vehiclesCount)).reduce((acc, _, idx) => ({ ...acc, [`/vehicle/${idx + 1}`]: `Vehicle ${idx+1}` }), {}),
          '/auto-summary': 'Summary'
        }
        break;
      default:
    }

    return Object.entries(routes)
  }
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

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
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

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

a,
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

nav a.router-link-exact-active {
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

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
