import type { SDKInputField } from '@/types'
import Portfolio from '@youngalfred/bowtie-sdk'
import { createStore } from 'vuex'

/**
 * Not in use!! This demo prefers the pinia library for state management;
 * however, if VueX is you preference, here's how that might like, at a basic level.
 */
export const store = createStore<{app: Portfolio}>({
  state () {
    return {
        app: new Portfolio(),
    }
  },
  mutations: {
    updateField: (state, { fieldname = "", value = "" }) => {
        const app = new Portfolio(state.app.application)
        const field = app.find(fieldname) as SDKInputField;

        if (field && field.value !== value) {
          app.set(field, value);
          state.app = app
        }
    },
}
})