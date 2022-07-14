
import type { OptionType } from '@youngalfred/bowtie-sdk'
export type {
  FieldType as SDKField,
  FieldGroup as SDKFieldGroup,
  InputFieldType as SDKInputField,
  OptionType as SDKOptionType
} from '@youngalfred/bowtie-sdk';
export type { GroupType as SDKGroupType } from '@youngalfred/bowtie-sdk/build/types'

export type CustomRenderer = 'grid-group'|'async-field'|'card'|'multi-select'
export interface Fieldgroup {
  id: string
  kind: 'fieldgroup'
  renderer?: CustomRenderer
  label: string
  subtitle: string
  info: string | null
  warning: string | null
  valid: boolean
  key: string
  classes: string[]
  children: (Fieldgroup | Field | Select | Radio)[]
}

export interface GenericField {
  id: string
  renderer?: CustomRenderer
  label: string
  subtitle: string
  placeholder: string
  value: string
  info: string | null
  warning: string
  decoration: string
  onChange: (_1: string) => void
  valid: boolean
  key: string
  classes: string[]
  sideEffect?: (isInitialRender: boolean) => Promise<void>
}

export interface Field extends GenericField {
  kind: 'text' | 'file' | 'check'
}

export interface Select extends GenericField {
  kind: 'select'
  options: OptionType[]
}

export interface Radio extends GenericField {
  kind: 'radio'
  option: OptionType
}

export type InputNode = Field | Select | Radio
export type Node = InputNode | Fieldgroup
export type ValidEvent = string | ((props: any) => void) 
export type EventHandlerFactory = (_0: string) => (_1: ValidEvent) => void
