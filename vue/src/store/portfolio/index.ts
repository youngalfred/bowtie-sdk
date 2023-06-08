import {
  Portfolio,
  startBowtieSession,
  BowtieHomePropertyDataService,
  BowtieAutoIdentityDataService,
  BowtieAutoMakesDataService,
  BowtieAutoModelsDataService,
  BowtieAutoBodyTypesDataService,
  getPartialPortfolio,
  authenticateSession,
} from '@youngalfred/bowtie-sdk'

import type {
  BowtieSdkConfig,
  ISubmitResult,
  PortfolioUpdatedCallback,
} from '@youngalfred/bowtie-sdk'
import { defineStore } from 'pinia'

import { getQuestionsForPage } from '@/data/pages'
import type { HomeSection } from '@/data/pages/home'
import type { AutoSection } from '@/data/pages/auto'
import type { SDKField, SDKFieldGroup, SDKInputField } from '@/types'
import { SESSION_ID, getCookies } from '@/utils/cookie'
import { reactive } from 'vue'

export type { PortfolioStore } from './types'

const base = '/'
// const base = 'http://localhost:3001' // during development

const retryErrorCodes = [500, 503, 504]

const getNewSessionId = async (): Promise<string> => {
  try {
    const { sessionId } = await startBowtieSession({ url: `${base}session`, retryErrorCodes })
    return sessionId
  } catch (err) {
    return 'NON_BOWTIE_SESSION_ID'
  }
}

const config = (
  sessionId: string,
  onPortfolioUpdated?: PortfolioUpdatedCallback,
): BowtieSdkConfig => ({
  onPortfolioUpdated,
  dataFillServices: {
    autoIdentityDataService: new BowtieAutoIdentityDataService({
      url: `${base}auto/vin/`,
    }),
    autoMakesDataService: new BowtieAutoMakesDataService({
      url: `${base}auto/makes`,
    }),
    autoModelsDataService: new BowtieAutoModelsDataService({
      url: `${base}auto/models`,
    }),
    autoBodyTypesDataService: new BowtieAutoBodyTypesDataService({
      url: `${base}auto/bodystyles`,
    }),
    homePropertyDataService: new BowtieHomePropertyDataService({
      url: `${base}property`,
    }),
  },
  partialUpdateOptions: {
    // configure the sdk send partial portfolio updates
    // as the customer completes the form. That way no
    // custoemr progress is lost if/when they resume the app later.
    sendPartialUpdates: true,
    url: `${base}session/${sessionId}/progress`,
    handleError: (_err: unknown) => {
      const error = _err as { statusCode?: number }
      if (error?.statusCode === 401) {
        // Reload to force user to re-authenticate
        window.location.reload()
      }
    },
  },
})

export const usePortfolio = defineStore('portfolio', {
  state: () => ({
    // Warning: if you make the portfolio
    // a direct property of the Vue state,
    // the UI will not update correctly when
    // this.onPortfolioUpdatedBySdk is called
    // by the sdk.
    app: { portfolio: new Portfolio() },
    checkingForStoredApplication: true,
    sessionId: getCookies()?.[SESSION_ID] ?? '',
    inReview: false,
    authorizedToAccessApp: true,
  }),
  getters: {
    portfolio: state => state.app.portfolio,
    // Get the questions for a specific section (or page)
    view:
      state =>
      (section: HomeSection | AutoSection): SDKFieldGroup[] => {
        try {
          return section
            ? (getQuestionsForPage(state.app.portfolio.view, section) as SDKFieldGroup[])
            : state.app.portfolio.view
        } catch (err) {
          return state.app.portfolio.view
        }
      },
    countOf: state => (entity: 'autos' | 'drivers') => {
      return parseInt(state.app.portfolio.find(`auto.${entity}.count`)?.value || '0', 10)
    },
    // Get a map of fields by their ids
    request:
      state =>
      (fieldIds: string[]): Record<string, SDKField> => {
        const findField = (
          acc: Record<string, SDKField>,
          fieldname: string,
        ): Record<string, SDKField> => {
          const field = state.app.portfolio.find(fieldname)
          if (field) {
            acc[fieldname] = field
          }

          return acc
        }
        return fieldIds.reduce(findField, {})
      },
    assertFieldEquals:
      state =>
      (
        id: string,
        value: string | null,
        { negate }: { negate: boolean } = { negate: false },
      ): boolean => {
        const isEqual = state.app.portfolio.find(id)?.value === value
        return negate ? !isEqual : isEqual
      },
  },
  actions: {
    async authenticate(email: string, birthDate: string): Promise<boolean> {
      try {
        const {
          authenticated,
          // attemptsRemaining,
          // lockedOut,
          // lockExpirationDate,
          // expirationDate
        } = await authenticateSession({
          url: `${base}session/${this.sessionId}/authenticate`,
          credentials: { email, birthDate },
        })

        if (authenticated) {
          this.authorizedToAccessApp = true
          return true
        }
      } catch (err) {
        // Do nothing
      }
      return false
    },
    updateSessionId(id: string) {
      // Remember the Bowtie Session Id to resume it later
      document.cookie = `${SESSION_ID}=${id}`
    },
    async initPortfolio() {
      if (!this.sessionId) {
        // Create new session
        const newSessionId = await getNewSessionId()

        this.updateSessionId(newSessionId)
        this.app = {
          portfolio: new Portfolio({
            ...config(newSessionId, this.onPortfolioUpdatedBySdk),
            application: JSON.parse(window.localStorage.getItem('bowtie_sdk_demo') || '{}'),
          }),
        }
        this.checkingForStoredApplication = false

        // return early as no partial app exists in the backend yet
        // (the session was just now created)
        return
      }

      try {
        // Resume the partial portfolio associated with the session
        const { data: application } = await getPartialPortfolio({
          url: `${base}session/${this.sessionId}/progress`,
        })
        this.app = {
          portfolio: new Portfolio({
            ...config(this.sessionId, this.onPortfolioUpdatedBySdk),
            application,
          }),
        }
      } catch (_err) {
        const error = _err as { statusCode?: number }
        if (error?.statusCode === 401) {
          this.authorizedToAccessApp = false
        } else {
          this.updateSessionId('')
          window.location.reload()
        }
      } finally {
        this.checkingForStoredApplication = false
      }
    },
    onPortfolioUpdatedBySdk(err: unknown, portfolio: Portfolio) {
      if (err) {
        console.error('SDK emitted an error after a field was updated.', err)
      }
      this.app = { portfolio }
    },
    async updateApp(cb: (_app: Portfolio) => Portfolio | null) {
      /**
       * When accessing this.app, we are given a proxy to the Portfolio instead
       * of the actual portfolio object (we want the actual portfolio, NOT the proxy).
       * The only way for the form to update as the SDK makes internal changes to the form
       * is to unwrap the proxy object with "reactive". After we have access to the true portfolio
       * object, we're able to then manipulate it (with portfolio.set(field, value)) and then
       * update vue's state with this.app = updatedApp.
       *
       * For more info on reactive, see the following:
       * https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive-proxy-vs-original-1
       */
      const portfolio = cb(reactive(this.app).portfolio as Portfolio)

      if (portfolio) {
        window.localStorage.setItem('bowtie_sdk_demo', JSON.stringify(portfolio.application))
        this.app = { portfolio }
      }
    },
    async resetApplication() {
      this.app = { portfolio: new Portfolio() }
      window.localStorage.removeItem('bowtie_sdk_demo')
      this.updateSessionId('')
    },
    updateField(fieldname: string) {
      const self = this
      return (value = '') => {
        self.updateApp(app => {
          const field = app.find(fieldname) as SDKInputField

          if (field && field.value !== value) {
            app.set(field, value)
            return app
          }

          return null
        })
      }
    },
    addAutoEntity(entity: 'driver' | 'auto') {
      const id = `auto.${entity}s.count`
      const count = parseInt(this.app.portfolio.find(id)?.value || '0', 10)

      this.updateField(id)(`${count + 1}`)
    },
    removeAutoEntity(entity: 'driver' | 'auto', id: number) {
      this.updateApp(app => {
        const prefix = `auto.${entity}s.`
        app.delMulti(`${prefix}${id}`, `${prefix}count`)
        return app
      })
    },
    setInReview(inReview: boolean) {
      this.inReview = inReview
    },
    async submit(): Promise<ISubmitResult> {
      return this.app.portfolio.submit({
        url: `${base}portfolio`,
        headers: {
          'x-session-id': this.sessionId,
          // any headers you might need to send
        },
      })
    },
  },
})
