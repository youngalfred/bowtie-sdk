import type Portfolio from '@youngalfred/bowtie-sdk'
import type { SDKField, SDKFieldGroup } from '@/types'
import type { AutoSection } from '@/data/pages/auto'
import type { HomeSection } from '@/data/pages/home'
import type { Store } from 'pinia'
import type { ISubmitResult } from '@youngalfred/bowtie-sdk'

type State = {
  app: { portfolio: Readonly<Portfolio> }
  inReview: boolean
  checkingForStoredApplication: boolean
  sessionId: string
  authorizedToAccessApp: boolean
}

export type PortfolioStore = Store<
  'portfolio',
  State,
  {
    portfolio: (state: State) => Portfolio
    view: (state: State) => (section: HomeSection | AutoSection) => SDKFieldGroup[]
    countOf: (state: State) => (entity: 'autos' | 'drivers') => number
    request: (state: State) => (fieldIds: string[]) => Record<string, SDKField>
    assertFieldEquals: (
      state: State,
    ) => (id: string, value: string | null, options: { negate: boolean }) => boolean
  },
  {
    updateField: (field: string) => (value: string) => void
    addAutoEntity: (entity: 'driver' | 'auto') => void
    removeAutoEntity: (entity: 'driver' | 'auto', id: number) => void
    setInReview: (inReview: boolean) => void
    submit: () => Promise<ISubmitResult>
    authenticate: (email: string, birthDate: string) => Promise<boolean>
    updateSessionId: (_: string) => void
    initPortfolio: () => Promise<void>
    onPortfolioUpdatedBySdk: (err: unknown, portfolio: Portfolio) => Promise<void>
    resetApplication: () => Promise<void>
  }
>
