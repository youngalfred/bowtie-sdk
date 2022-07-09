import Portfolio, { type InputFieldType } from '@youngalfred/bowtie-sdk'
import { defineStore } from 'pinia'

import { getQuestionsForPage } from '@/data/pages'
import type { HomeSection } from '@/data/pages/home'
import type { AutoSection } from '@/data/pages/auto'

export const usePortfolio = defineStore('portfolio', {
  // a function that returns a fresh state
  state: () => ({
      app: new Portfolio(),
      
  }),
  getters: {
    view: (state) => (section: HomeSection|AutoSection) => {
      return section
        ? getQuestionsForPage(state.app.view, section)
        : state.app.view
    }
  },
  actions: {
    updateField(fieldname = "") {
      const self = this;
      const app = new Portfolio({...this.app.application})
      return (value = "") => {
        let field = app.find(fieldname) as InputFieldType;

        if (field && field.value !== value) {
          app.set(field, value);
          console.log({value: app.find(fieldname)?.value })
          self.app = app
          // window.localStorage.setItem("bowtie_sdk_demo", JSON.stringify(this.app.application));
        }
      };
    }
  },
})