

import Text from '../fields/input/Text.vue'
import Select from '../fields/input/Select.vue'
import Check from '../fields/input/Check.vue'
import Radio from '../fields/input/Radio.vue'
import Fieldgroup from './Index.vue'
import GridGroup from './GridGroup.vue'
import type { Node } from '../../types'

export const ID_HANDLERS: Record<string, any> = {
  'house-type': GridGroup,
  'construction-type': GridGroup,
  'occupants': GridGroup,
  'policy-type': GridGroup,
  'start-name': GridGroup,
  'start-address-n': GridGroup,
  'gender': GridGroup,
  'property-type': GridGroup,
  'add-secondary-policy-holder': GridGroup,
  'extra-coverages': GridGroup,
  'extras': GridGroup,
  'pets': GridGroup,
  'roof-material': GridGroup,
  'roof-shape': GridGroup,
  'primary-heat-source': GridGroup,
  'valuables': GridGroup,
  'any-updates': GridGroup,
  'plan-type': GridGroup,
  'secondary-months-occupied': GridGroup,
}

export const TYPE_HANDLERS: Record<Node['kind'], any> = {
  'text': Text,
  'select': Select,
  'radio': Radio,
  'check': Check,
  'file': null,
  'fieldgroup': Fieldgroup
}

// prettier-ignore
export const CLASS_HANDLERS: Record<string, any> = {
  // 'multi-select-dropdown': LabeledField(PoppedField(MultiSelect)),
  // 'card-fieldgroup': CardFieldgroup,
  // 'icon-checkbox': IconCheckboxField,
  // 'icon-group-item': IconCardFieldgroup,
  // 'inline-select-checkbox': Checkbox,
  // 'input-file': LabeledField(PoppedField(TextInput)),
  // 'input-full-date': LabeledField(PoppedField(DateInput)),
  // 'input-money': LabeledField(PoppedField(MoneyInput)),
  // 'input-number': LabeledField(PoppedField(NumberInput)),
  // 'input-phone': LabeledField(PoppedField(PhoneInput)),
  // 'is-address': LabeledField(AddressField),
  // 'money': LabeledField(PoppedField(MoneyInput)),
  // 'month-year-input': LabeledField(PoppedField(ShortDateInput)),
  // 'multi-checkbox': LabeledField(Fieldgroup),
  // 'multi-select-with-check': IconCardFieldgroup,
  // 'photo-group-item': PhotoCardFieldgroup,
  // 'select-dropdown': LabeledField(PoppedField(Dropdown)),
  // 'select-label-chip': LabeledField(PoppedField(Dropdown)),
  // 'select-label-illustration': LabeledField(IconCardField),
  // 'select-label-image': LabeledField(PhotoCardField),
  // 'select-protocol-checkbox': Checkbox,
  // 'select-radio': LabeledField(PoppedField(RadioField)),
  // 'textbox': LabeledField(PoppedField(TextAreaInput)),
  // 'checkbox': PoppedField(Checkbox),
  // 'florida-wind': WindMitigation, // FloridaWindMitigation,
};
