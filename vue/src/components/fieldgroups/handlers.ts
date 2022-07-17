

import Text from '../fields/input/Text.vue'
import Check from '../fields/input/Check.vue'
import FieldWithSideEffect from '../fields/FieldWithSideEffect.vue'
import File from '../fields/input/File.vue'
import MultiSelect from '../fields/input/MultiSelect.vue'
import Radio from '../fields/input/Radio.vue'
import Select from '../fields/input/Select.vue'


import Fieldgroup from './Index.vue'
import GridGroup from './GridGroup.vue'
import Card from './CardGroup.vue'
import WindMit from './WindMit/Index.vue'

import type { TypeHandler, CustomRendererHandler } from '../../types'

export const TYPE_HANDLERS: TypeHandler = {
  'text': Text,
  'select': Select,
  'radio': Radio,
  'check': Check,
  'file': File,
  'fieldgroup': Fieldgroup,
}

export const CUSTOM_RENDERER_HANDLERS: CustomRendererHandler = {
  'grid-group': GridGroup,
  'async-field': FieldWithSideEffect,
  'card': Card,
  'multi-select': MultiSelect,
  'fl-windmit': WindMit,
}