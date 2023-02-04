import {
  Portfolio,
  OptionType,
  FieldType as SDKField,
  InputFieldType as SDKInputField,
  FieldGroup as SDKFieldGroup,
} from '@youngalfred/bowtie-sdk'

export { OptionType, SDKField, SDKInputField, SDKFieldGroup }
export interface Application {
  portfolio: Portfolio
  currentSection: number
  currentFieldgroup: string
  isSubmitted: boolean
  isInReview: boolean
  partner: string
  sessionId: string
  nextSectionSelected: boolean
}
export interface Fieldgroup {
  id: string
  kind: 'fieldgroup'
  label: string
  image?: string
  classes: string
  decoration: Record<string, string>
  children: Node[]
}

export interface GenericField {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  classes: string // A string of classes to assist the UI. Ex: phone number fields' classes => "input-phone ..."
  testId: string
  image?: string
  applySideEffect?: () => Promise<void>
  valid: SDKField['valid']
}

export interface Field extends GenericField {
  kind: 'text' | 'check'
}

export interface Select extends GenericField {
  kind: 'select'
  options: OptionType[]
}

export interface FileInput extends GenericField {
  kind: 'file'
  uploadFiles: (files: File[]) => Promise<{ fileName: string; objectId: string }[]>
}

export interface Radio extends GenericField {
  kind: 'radio'
  option: OptionType
}

export type InputNode = Field | Select | Radio | FileInput
export type Node = InputNode | Fieldgroup
