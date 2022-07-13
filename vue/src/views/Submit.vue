<script setup lang='ts'>
  import { usePortfolio } from '@/store/portfolio';
  import { onMounted, reactive } from 'vue';
  import { storeToRefs } from 'pinia';
  import NavBar from '../components/NavBar.vue';

  const { app } = storeToRefs(usePortfolio())
  const data = reactive({
    isSubmitting: true,
    isSuccess: false,
  })

  onMounted(async () => {
      let succeeded = false
      try {
        await app.value.submit({
          headers: {
            // any headers you might need to send
          }
        })
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
