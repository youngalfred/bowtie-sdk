import { useState } from 'react'
import Portfolio from '@youngalfred/bowtie-sdk'

type InnerPortfolioState = { app: Portfolio }
type UpdateBase = {
  fieldname: string
  value: string
}

export type UpdatePayload = UpdateBase | UpdateBase[]
export type PortfolioState = [Portfolio, (payload: UpdatePayload) => void]

const usePortfolio = (initialApp: Record<string, any>): PortfolioState => {
  const [{ app: portfolio }, setPortfolio] = useState<InnerPortfolioState>({
    app: new Portfolio({
      application: initialApp,
    }),
  })

  const updateField = (payload: UpdatePayload): void => {
    const payloadArray = Array.isArray(payload) ? payload : [payload]

    setPortfolio(prev => {
      const attemptUpdate = ({ fieldname, value }: UpdateBase) => {
        const field = prev.app.find(fieldname)

        try {
          if (!field) {
            throw new Error(`CRITICAL: Unable to find field ${fieldname}`)
          }
          prev.app.set(field, value)
        } catch (err: unknown) {
          console.error(
            'update-field-threw-exception',
            {
              err,
              fieldname,
              value,
            },
            `Encountered an exception while attempting to update '${fieldname}'.`,
          )
        }
      }

      payloadArray.forEach(attemptUpdate)
      return { app: prev.app }
    })
  }

  return [portfolio, updateField]
}

export default usePortfolio
