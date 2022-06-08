import Portfolio from '@youngalfred/bowtie-sdk'
import { defineStore } from 'pinia'

import { getQuestionsForPage } from '@/data/pages'
import type { HomeSection } from '@/data/pages/home'
import type { AutoSection } from '@/data/pages/auto'
import type { SDKField, SDKFieldGroup, SDKGroupType, SDKInputField } from '@/types'

export const usePortfolio = defineStore('portfolio', {
  state: () => ({
      app: new Portfolio(JSON.parse(window.localStorage.getItem('young_alfred_vue') || '{}')),
      inReview: false,
  }),
  getters: {
    view: (state) => (section: HomeSection|AutoSection): SDKFieldGroup[] => {

      return section
        ? getQuestionsForPage(state.app.view, section) as SDKFieldGroup[]
        : state.app.view
    },
    countOf: (state) => (entity: 'autos'|'drivers') => {
      return parseInt(state.app.find(`auto.${entity}.count`)?.value || '0', 10)
    },
    // Request is not used currently. Probably no need
    request: (state) => (fieldIds: string[]): Record<string, SDKField> => {
      const requestedFieldSet = new Set(fieldIds)

      const findField = (acc: Record<string, SDKField>, nextNode: SDKField): Record<string, SDKField> => {
        if (requestedFieldSet.has(nextNode.id)) {
          acc[nextNode.id] = nextNode
        }

        const { children = [] } = nextNode as SDKGroupType
        if (children.length) {
          return children.reduce(findField, acc)
        }

        return acc
      }

      return state.app.view.reduce(findField, {})
    },
    assertFieldEquals: (state) => (id: string, value: string|null, { negate }: { negate: boolean } = { negate: false }): boolean => {
      const isEqual = state.app.find(id)?.value === value
      return negate ? !isEqual : isEqual
    }
  },
  actions: {
    updateField(fieldname = "") {
      const self = this;
      const app = new Portfolio({...this.app.application})
      return (value = "") => {
        let field = app.find(fieldname) as SDKInputField;

        if (field && field.value !== value) {
          app.set(field, value);
          self.app = app
          window.localStorage.setItem("young_alfred_vue", JSON.stringify(this.app.application));
        }
      };
    },
    addAutoEntity(entity: 'driver'|'auto') {
      const id = `auto.${entity}s.count`
      const count = parseInt(this.app.find(id)?.value || '0', 10)

      this.updateField(id)(`${count+1}`)
    },
    removeAutoEntity(entity: 'driver'|'auto', id: number) {
      const app = new Portfolio({...this.app.application})

      const prefix = `auto.${entity}s.`
      app.delMulti(`${prefix}${id}`, `${prefix}count`)
      this.app = app
    },
    setInReview(inReview: boolean) {
      this.inReview = inReview
    }
  },
})