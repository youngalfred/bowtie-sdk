<script setup lang="ts">
import { reactive } from 'vue'
import NavBar from '@/components/NavBar.vue'
import Renderer from '@/components/Renderer.vue'
import router from '@/router'

import { usePortfolio } from '@/store/portfolio'
import type { Fieldgroup } from '@/types'


const store = usePortfolio()
const inputs = reactive({
    email: '',
    birthDate: '',
    touched: {email: false, birthDate: false}
})

// of course, you'd want to actually verify the input looks like an email here
const validEmail = inputs.email.length > 3
const validISOPatternBday = /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(inputs.birthDate)

const fg: Fieldgroup = {
    id: 'auth.fieldgroup',
    subtitle: '',
    warning: '',
    info: '',
    key: 'fg',
    valid: true,
    classes: [],
    kind: 'fieldgroup',
    label: 'To you continue your application, please validate the email and birth date on your application',
    children: [
        {
            id: 'authenticate.email',
            kind: 'text',
            label: 'Email Address',
            placeholder: 'Email',
            value: inputs.email,
            subtitle: '',
            info: '',
            warning: validEmail && inputs.touched.email ? 'Please enter a valid email' : '',
            decoration: '',
            valid: validEmail, 
            key: 'email',
            onChange: v => {
                inputs.email = v
                inputs.touched = {
                    ...inputs.touched,
                    email: true
                }
            },
            classes: [],
        },
        {
            id: 'authenticate.birthDate',
            kind: 'text',
            label: 'Birth Date',
            placeholder: 'YYYY-MM-DD',
            value: inputs.birthDate,
            subtitle: '',
            info: '',
            decoration: '',
            warning: validISOPatternBday && inputs.touched.birthDate ? 'Please enter a valid birth date' : '',
            valid: validISOPatternBday,
            key: 'birthDate',
            onChange: v => {
                inputs.birthDate = v
                inputs.touched = {
                    ...inputs.touched,
                    birthDate: true
                }
            },
            classes: [],
        }
    ]
}

const submit = async () => {
    const success = await store.authenticate(inputs.email, inputs.birthDate)
    if (success) {
        router.push('/')
    }
}

</script>

<template>
    <div id="wrapper">
      <h1>Authenticate</h1>
    <Renderer :key="fg.id" :field="fg" />
  </div>
  <NavBar
    :buttons="[
      {
        label: 'Submit',
        path: '/',
        onClick: submit,
        disabled: false,
      },
    ]"
  />
</template>

<style>
#wrapper {
  margin-bottom: 150px;
  padding: 2rem;
}
</style>
