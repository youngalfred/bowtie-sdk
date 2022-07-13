import Portfolio, { type BowtieSdkConfig, type SelectField } from '@youngalfred/bowtie-sdk'
import { defineStore } from 'pinia'

import { getQuestionsForPage } from '@/data/pages'
import type { HomeSection } from '@/data/pages/home'
import type { AutoSection } from '@/data/pages/auto'
import type { InputNode, SDKField, SDKFieldGroup, SDKGroupType, SDKInputField } from '@/types'
import type { VinData, BodyStylesData, MakesData, ModelsData, ResultMapper } from '@/types/auto-service'

export type { PortfolioStore } from './types'

const base = ''
// const base = 'http://localhost:3001' // during development

const retryErrorCodes = [500, 503, 504]
const config: BowtieSdkConfig = {
  // We provide defaults values for the below endpoints,
  // but you will likely need to overwrite/customize for your own app:
  apiUrls: {
    submit: `${base}/portfolio/submit`,
    getAutoByVin: `${base}/auto/vin/`, // notice the trailing '/'
    getAutoMakesByYear: `${base}/auto/makes`,
    getAutoModelsByYearAndMake: `${base}/auto/models`,
    getAutoBodyTypesByYearMakeAndModel: `${base}/auto/bodystyles`
  },
  /**
   * The sdk will retry failed requests (for the above api endpoints)
   * three times at most (after the initial failure) when one of the following conditions is met:
   * - an http error code that you specified in the retryErrorCodes section below is received
   * - the request fails to send
   * - no response is received (timeout)
   */
  retryErrorCodes: {
    submit: retryErrorCodes,
    getAutoByVin: retryErrorCodes,
    getAutoMakesByYear: retryErrorCodes,
    getAutoModelsByYearAndMake: retryErrorCodes,
    /**
     * By omitting retry codes for the following endpoints,
     * you are signaling not to retry failed requests for said endpoints:
     */ 
    getAutoBodyTypesByYearMakeAndModel: [],
  }
}


export const usePortfolio = defineStore('portfolio', {
  state: () => ({
      app: new Portfolio({
        ...config,
        application: JSON.parse(window.localStorage.getItem('bowtie_sdk_demo') || '{}')
      }),
      fieldOverrides: {} as Record<string, Partial<InputNode>>,
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
    // Because this.application is readonly ( this.app.set(field, value) will not trigger a re-render ),
    // we are forced to create a new Portfolio object on each update and overrwrite the existing portfolio;
    // if you are a better way that doesn't require building a new Portfolio on each update, please
    // share your approach! The current approach is highly suboptimal as it requires that we track the fields
    // that have been overwritten.
    async updateApp(cb: (_app: Portfolio) => Promise<Portfolio|null>) {

      const app = await cb(
        new Portfolio({
          ...config,
          application: this.app.application
        })
      )

      if (app) {
        window.localStorage.setItem('bowtie_sdk_demo', JSON.stringify(app.application));
        this.app = app
      }
    },
    updateField(fieldname = '') {
      const self = this;
      return (value = '') => {
        self.updateApp(app => {
          const field = app.find(fieldname) as SDKInputField;
  
          if (field && field.value !== value) {
            app.set(field, value);
            return Promise.resolve(app)
          }

          return Promise.resolve(null)
        })
      }
    },
    addAutoEntity(entity: 'driver'|'auto') {
      const id = `auto.${entity}s.count`
      const count = parseInt(this.app.find(id)?.value || '0', 10)

      this.updateField(id)(`${count+1}`)
    },
    removeAutoEntity(entity: 'driver'|'auto', id: number) {
      this.updateApp(app => {
        const prefix = `auto.${entity}s.`
        app.delMulti(`${prefix}${id}`, `${prefix}count`)
        return Promise.resolve(app)
      })
    },
    setInReview(inReview: boolean) {
      this.inReview = inReview
    },
    removeOverride(fieldname: string) {
      const {[fieldname]: _removed, ...rest } = this.fieldOverrides
      this.fieldOverrides = rest
    },
    async fetchAndFillAutoByVin(autoIdx: number, field: InputNode) {
      const idPrefix = `auto.autos.${autoIdx}.`
      const hasVin = this.app.find(`${idPrefix}hasVinNumber`)?.value === 'yes';

      const isValidVINLength = field?.value.length === 17

      if (!(hasVin && isValidVINLength)) {
        this.removeOverride(`${idPrefix}year`)
      }

      this.updateApp(async app => {
        try {
          await app.fillAutoWithVinData<VinData>(autoIdx, {
            resultsMapper: ({ year, make, model, bodyStyle }) => ({ year, make, model, bodyType: bodyStyle }),
            headers: {
                // ... any headers you might need to send
            }
          })

          const autoOverrides = () => [
            'year', 'make', 'model', 'bodyType'
          ].reduce((acc, next) => {
            const id = `auto.autos.${autoIdx}.${next}`
            const field = app.find(id) as SelectField

            return {
              ...acc,
              [id]: {
                options: field.options
              }
            }
          }, {})

          this.fieldOverrides = {
            ...this.fieldOverrides,
            ...autoOverrides,
          }
          return app
        } catch (err) {
          console.error(err)
          return null
        }
      })
    },
    async overrideAutoOptionsFor(key: 'make'|'model'|'bodyType', triggerField: InputNode, autoIdx: number) {
      const sdkAutoFn = ({
        make: 'updateAutoMakeOptions',
        model: 'updateAutoModelOptions',
        bodyType: 'updateAutoBodyTypeOptions',
      })[key]

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
      const fieldtoUpdate = this.app.find(`${autoPrefix}${key}`) as SelectField
      const shallOverrideOptions = (
        /**
         * When the year entered is earlier than 1981,
         * the car identity fields (make, model, body type)
         * become text inputs because the national vin service
         * does not have record of vehicles older than 1981. 
         */
        triggerField.kind === 'select'
        // For example, ensure year has been selected before
        // trying to retrieve makes by year
        && !!triggerField.value
        // only override options when not using the sister service:
        // vin prefill, which causes the options to be length 1
        && fieldtoUpdate?.options.length !== 1
      )

      if (!shallOverrideOptions) {
          return
      }

      this.updateApp(async (app: Portfolio) => {
        try {
          await app[sdkAutoFn as keyof typeof app]?.(autoIdx, {
            resultsMapper: resultMappers[key]
          })
          this.fieldOverrides = {
            ...this.fieldOverrides,
            ...(() => {
              const id = `auto.autos.${autoIdx}.${key}`
              const field = app.find(id) as SelectField

              return {
                [id]: {
                  options: field.options
                }
              }
            })()
          }
          return app
        } catch (err: any) {
          const wasCarAlreadyRetrievedByVin = (err?.code || '') === 'ABORT_AUTO_OPTIONS_OVERRIDE'
    
          if (wasCarAlreadyRetrievedByVin) {
              // The service isn't down (no need to convert to text fields),
              // we simply prioritized using the vin service's results 
              return null
          }

          // Keep in order of progression (can't fill out model without make first)
          const fieldsToConvert: typeof key[] = ['make', 'model', 'bodyType']
          const idxOfCurrent = fieldsToConvert.indexOf(key)
          if (idxOfCurrent < 0) {
              throw new Error('Ensure the auto field ids align with your expectations.')
          }

          fieldsToConvert.slice(idxOfCurrent).forEach(keyOfFailure => {
            const id = `${autoPrefix}${keyOfFailure}`  
            // vin service is down,
            // but customers still need the ability
            // to enter their car's data:
            this.fieldOverrides = {
              ...this.fieldOverrides,
              [id]: { kind: 'text' }
            }
          })

          return app
        }
      })
    },
  },
})