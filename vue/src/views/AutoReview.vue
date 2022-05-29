<script setup lang="ts">
  import PolicySection from '@/components/PolicySection.vue';
 
</script>

<template>
  <PolicySection section='auto-summary' />
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
