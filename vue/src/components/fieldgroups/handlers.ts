

import Text from '../fields/input/Text.vue'
import Select from '../fields/input/Select.vue'
import Check from '../fields/input/Check.vue'
import Radio from '../fields/input/Radio.vue'
import FieldWithSideEffect from '../fields/FieldWithSideEffect.vue'
import Fieldgroup from './Index.vue'
import GridGroup from './GridGroup.vue'
import Card from './CardGroup.vue'
import type { CustomRenderer, Node } from '../../types'

export const ID_HANDLERS: Record<string, any> = {
  // one-offs
}

export const TYPE_HANDLERS: Record<Node['kind'], any> = {
  'text': Text,
  'select': Select,
  'radio': Radio,
  'check': Check,
  'file': null,
  'fieldgroup': Fieldgroup
}

export const CUSTOM_RENDERER_HANDLERS: Record<CustomRenderer, any> = {
  'grid-group': GridGroup,
  'async-field': FieldWithSideEffect,
  'card': Card,
}