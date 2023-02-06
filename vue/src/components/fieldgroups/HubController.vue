<script setup lang="ts">
import type { PropType } from 'vue'
import { RouterLink } from 'vue-router'

defineProps({
  addEntity: {
    type: Function as PropType<() => void>,
  },
  removeEntity: {
    type: Function as PropType<(id: number) => void>,
  },
  makePathLabelPair: {
    type: Function as PropType<() => [string, string][]>,
    required: true,
  },
})
</script>

<template>
  <div id="hub">
    <div id="wrapper">
      <div class="entity" v-for="([path, label], index) of makePathLabelPair()">
        <RouterLink :to="path" custom v-slot="{ navigate }">
          <button @click="navigate" @keypress.enter="() => navigate()" role="link">
            {{ label }}
          </button>
        </RouterLink>
        <button v-if="index" @click="removeEntity?.(index)">Remove</button>
      </div>
      <button @click="addEntity">Add +</button>
    </div>
  </div>
</template>

<style scoped>
#hub {
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
}

#wrapper {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 300px;
}

#wrapper > button {
  align-self: flex-start;
}

.entity {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  border: 1px solid black;
  background-color: #efefef;
  padding: 5px;
}

button {
  cursor: pointer;
}
</style>
