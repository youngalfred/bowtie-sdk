<script setup lang="ts">
  import { usePortfolio } from '@/store/portfolio';
  import { storeToRefs } from 'pinia';
  import NavBar from '../components/NavBar.vue';
  import { submit } from '@/api/submit';
  import { onMounted, reactive } from 'vue';

  const { app } = storeToRefs(usePortfolio())
  const data = reactive({
    isSubmitting: true,
    isSuccess: false,
  })

  onMounted(async () => {
      let succeeded = false
      try {
        await submit(app.value.payload)
        succeeded = true  
      } catch (err) {
        console.error(err)
      } finally {
        data.isSubmitting = false
        data.isSuccess = succeeded
      }
  })
</script>

<template>
<div>
  <h2>
    {{data.isSubmitting
      ? '...Submitting'
      : data.isSuccess ? (
        'Success'
      ) : (
        'Failed Submission'
      )}}
  </h2>
</div>
  <NavBar :buttons="[
    {
      label: 'Submit Another',
      path: '/',
      disabled: false
    }
  ]"/>
</template>

<style>

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
