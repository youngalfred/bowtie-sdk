import Portfolio from '@youngalfred/bowtie-sdk'
import { defineStore } from 'pinia'

import { getQuestionsForPage } from '@/data/pages'
import type { HomeSection } from '@/data/pages/home'
import type { AutoSection } from '@/data/pages/auto'
import type { SDKField, SDKFieldGroup, SDKGroupType, SDKInputField } from '@/types'
import type { VinData, BodyStylesData, MakesData, ModelsData, SdkAutoFn, ResultMapper } from '@/types/auto-service'

// type State = {
//   app: Readonly<Portfolio>,
//   inReview: boolean
// }

// export type PortfolioStore = Store<'portfolio', State,
//   {
//     view: (state: State & PiniaCustomStateProperties<any>) => (section: HomeSection|AutoSection) => SDKFieldGroup[],
//     countOf: (state: State & PiniaCustomStateProperties<any>) => (entity: 'autos'|'drivers') => number,
//     request: (state: State & PiniaCustomStateProperties<any>) => (fieldIds: string[]) => Record<string, SDKField>,
//     assertFieldEquals: (state: State & PiniaCustomStateProperties<any>) => (id: string, value: string|null, options: { negate: boolean }) => boolean
//   },
//   {
//     updateField: (field: string) => (value: string) => void
//     addAutoEntity: (entity: 'driver'|'auto') => void,
//     removeAutoEntity: (entity: 'driver'|'auto', id: number) => void,
//     setInReview: (inReview: boolean) => void,
//     fetchAndFillAutoByVin: (autoIdx: number) => Promise<void>
//     overrideAutoOptionsFor: (key: 'make'|'model'|'bodyType', autoIdx: number) => Promise<void>
//   }
// >

export const usePortfolio = defineStore('portfolio', {
  state: () => ({
      app: new Portfolio({
        application: JSON.parse(window.localStorage.getItem('bowtie_sdk_demo') || '{}')
      }),
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
      const app = new Portfolio({ application: this.app.application })
      return (value = "") => {
        let field = app.find(fieldname) as SDKInputField;

        if (field && field.value !== value) {
          app.set(field, value);
          self.app = app
          window.localStorage.setItem("bowtie_sdk_demo", JSON.stringify(this.app.application));
        }
      };
    },
    addAutoEntity(entity: 'driver'|'auto') {
      const id = `auto.${entity}s.count`
      const count = parseInt(this.app.find(id)?.value || '0', 10)

      this.updateField(id)(`${count+1}`)
    },
    removeAutoEntity(entity: 'driver'|'auto', id: number) {
      const app = new Portfolio({ application: this.app.application })

      const prefix = `auto.${entity}s.`
      app.delMulti(`${prefix}${id}`, `${prefix}count`)
      this.app = app
    },
    setInReview(inReview: boolean) {
      this.inReview = inReview
    },
    async fetchAndFillAutoByVin(autoIdx: number) {
      await this.app.fillAutoWithVinData<VinData>(autoIdx, {
        resultsMapper: ({ year, make, model, bodyStyle }) => ({ year, make, model, bodyType: bodyStyle }),
        headers: {
            // ... any headers you might need to send
        }
      })
    },
    async overrideAutoOptionsFor(key: 'make'|'model'|'bodyType', autoIdx: number) {

      const sdkAutoFns: Record<typeof key, SdkAutoFn> = {
        make: this.app.updateAutoMakeOptions,
        model: this.app.updateAutoModelOptions,
        bodyType: this.app.updateAutoBodyTypeOptions,
      }

      const resultMappers: Record<typeof key, ResultMapper> = {
        'make': ({ makes }: MakesData) => makes.map(
          ({ description }) => ({ name: description, label: description })
        ),
        'model': ({ models }: ModelsData) => models.map(
          ({ model }) => ({ name: model, label: model })
        ),
        'bodyType': ({ bodyStyles }: BodyStylesData) => bodyStyles.map(
          ({ description }) => ({ name: description, label: description })
        ),
      }

      const autoPrefix = `auto.autos.${autoIdx}.`
      const field = this.app.find(`${autoPrefix}${key}`)
      const shallOverrideOptions = (
        /**
         * When the year entered is earlier than 1981,
         * the car identity fields (make, model, body type)
         * become text inputs because the national vin service
         * does not have record of vehicles older than 1981. 
         */
        field?.kind === "select"
        // For example, ensure year has been selected before
        // trying to retrieve makes by year
        && !!field.value
        // only override options when not using the sister service:
        // vin prefill, which causes the options to be length 1
        && field.options.length !== 1
    )

    if (!shallOverrideOptions) {
        return false
    }

    try {
        await sdkAutoFns[key]?.(autoIdx, {
          resultsMapper: resultMappers[key]
        })
    } catch (err: any) {
        const wasCarAlreadyRetrievedByVin = (err?.code || '') === 'ABORT_AUTO_OPTIONS_OVERRIDE'

        if (wasCarAlreadyRetrievedByVin) {
            // The service isn't down (no need to convert to text fields),
            // we simply prioritized using the vin service's results 
            return
        }

        // Keep in order of progression (can't fill out model without make first)
        const fieldsToConvert: typeof key[] = ['make', 'model', 'bodyType']
        const idxOfCurrent = fieldsToConvert.indexOf(key)
        if (idxOfCurrent < 0) {
            throw new Error("Ensure the auto field ids align with your expectations.")
        }
        fieldsToConvert.slice(idxOfCurrent).forEach(keyOfFailure => {
            // vin service is down,
            // but customers still need the ability
            // to enter their car's data:
            this.app._overwriteField(`${autoPrefix}${keyOfFailure}`, { kind: 'text' })
        })
      }
    },
  },
})