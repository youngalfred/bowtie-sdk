import Portfolio, { InputFieldType } from '@youngalfred/bowtie-sdk'
import { PortfolioState } from './usePortfolio'
import { ChangeEvent, InputHTMLAttributes } from 'react'

// [sdk field id, optional alias for the field id]
export type FieldIdPair = [string, string?]

export type InputField = InputFieldType & {
  onChange: <T extends HTMLInputElement | HTMLSelectElement>(e: ChangeEvent<T>) => void
  inputProps: InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>
}

type Renderer = 'input' | 'select'

export const dotsToDashes = (s: string): string => s.replace(/\./g, '-')

const inputProps: Record<string, [Renderer, InputField['inputProps']?]> = {
  'start.policyType': ['select', {}],
  'start.firstName': ['input'],
  'start.emailAddress': [
    'input',
    {
      type: 'email',
    },
  ],
  'home.primaryPolicyHolder.birthDate': [
    'input',
    {
      placeholder: 'YYYY-MM-DD',
    },
  ],
  'auto.drivers.0.birthDate': [
    'input',
    {
      placeholder: 'YYYY-MM-DD',
    },
  ],
}

const overrides: Record<string, Partial<InputFieldType>> = {
  'start.policyType': {
    label: 'Which policy type does your client need?',
  },
  'start.firstName': {
    label: "Client's first name?",
  },
  'start.emailAddress': {
    label: "Client's email?",
  },
  'home.primaryPolicyHolder.birthDate': {
    label: "Client's birth date?",
  },
  'auto.drivers.0.birthDate': {
    label: "Client's birth date?",
  },
}

export const useFields = <T extends Record<string, InputField>>(
  portfolio: Portfolio,
  fieldIds: FieldIdPair[],
  updateField: PortfolioState[1],
) =>
  fieldIds.reduce((acc: T, [id, alias = id]): T => {
    const field = portfolio.find(id)
    if (!field) return acc

    return {
      ...acc,
      [alias]: {
        ...field,
        ...(overrides[field.id] ?? {}),
        inputProps: {
          id: dotsToDashes(field.id),
          value: field.value,
          onChange: ({ currentTarget: { value } }) => updateField({ fieldname: field.id, value }),
          required: true,
          ...(inputProps[field.id]?.[1] ?? {}),
        },
      },
    }
  }, {} as T)

export default useFields
