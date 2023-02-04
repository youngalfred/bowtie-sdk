<script setup lang="ts">
import type { PropType } from 'vue'
import { RouterLink } from 'vue-router'
import type { ButtonAction } from '@/types/props'

const { buttons } = defineProps({
  buttons: {
    type: Object as PropType<ButtonAction[]>,
    required: true,
  },
})

const buttonCount = (() => {
  switch (buttons.length) {
    case 1:
      return 'one'
    case 2:
      return 'two'
    case 3:
      return 'three'
    default:
      return 'default'
  }
})()
</script>

<template>
  <section :class="buttonCount">
    <template v-for="btn in buttons" :key="btn.path">
      <button
        v-if="btn.onClick"
        tabindex="0"
        :disabled="btn.disabled"
        @click="btn.onClick"
        @keypress.enter="btn.onClick"
        role="link"
      >
        {{ btn.label }}
      </button>
      <RouterLink v-else :to="btn.path" tabindex="0" :class="`${btn.disabled ? 'disabled' : ''}`">{{
        btn.label
      }}</RouterLink>
    </template>
  </section>
</template>

<style scoped>
section {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 100px;
  background-color: #559d29;
  padding: 1em;
  margin: 0 auto;
  text-align: center;
  z-index: 20;
}

a,
button {
  padding: 1em;
  align-self: center;
  border-radius: 5px;
  border: 1px solid white;
  background-color: white;
  color: #559d29;
  font-weight: 700;
}

a.disabled,
button:disabled {
  pointer-events: none;
  background-color: #efefef;
  color: #ababab;
}

a:hover,
a:active,
button:hover,
button:active {
  cursor: pointer;
  color: white;
  background-color: rgb(85, 157, 41, 0.25);
}

.one {
  display: flex;
  justify-content: center;
}

.two {
  display: flex;
  justify-content: space-evenly;
}

.three {
  display: grid;
  grid-template-columns: repeat(3, minmax(70px, 1fr));
}
</style>
