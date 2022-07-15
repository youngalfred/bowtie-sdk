import type Portfolio from '@youngalfred/bowtie-sdk'
import type { SDKField, SDKFieldGroup } from '@/types'
import type { AutoSection } from '@/data/pages/auto'
import type { HomeSection } from '@/data/pages/home'
import type { Store } from 'pinia'

type State = {
  app: Readonly<Portfolio>,
  inReview: boolean
}

export type PortfolioStore = Store<'portfolio', State,
  {
    view: (state: State) => (section: HomeSection|AutoSection) => SDKFieldGroup[],
    countOf: (state: State) => (entity: 'autos'|'drivers') => number,
    request: (state: State) => (fieldIds: string[]) => Record<string, SDKField>,
    assertFieldEquals: (state: State) => (id: string, value: string|null, options: { negate: boolean }) => boolean
  },
  {
    updateField: (field: string) => (value: string) => void
    addAutoEntity: (entity: 'driver'|'auto') => void,
    removeAutoEntity: (entity: 'driver'|'auto', id: number) => void,
    setInReview: (inReview: boolean) => void,
    fetchAndFillAutoByVin: (autoIdx: number) => Promise<void>
    overrideAutoOptionsFor: (key: 'make'|'model'|'bodyType', autoIdx: number) => Promise<void>
  }
>