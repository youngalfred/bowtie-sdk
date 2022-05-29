

import Text from '../fields/input/Text.vue'
import Select from '../fields/input/Select.vue'
import Check from '../fields/input/Check.vue'
import Fieldgroup from './Index.vue'
import type { Node } from '../../types'

export const CUSTOM_HANDLERS = {
  // 'auto.requestedPlanType': IconCardField),
  // 'home.plan.requestedPlanType': IconCardField),
  // 'home.propertyUse.rental.allTenantsRelated': RadioField,
  // 'home.yearBuilt': LabeledField(PoppedField(IntegersInput)),
  // 'rental-property-tenants': CardFieldgroup,
  // 'secondary-months-occupied': CardFieldgroup,
  // 'start.streetAddress': InformedField(TextInput),
  // /^(home|auto)\.disclaimer$/: PoppedField(Checkbox),
  // /^auto\.autos\.\d+\.driverIds$/: LabeledField(MultiCheckbox),
  // /^home.seasonalUse.months(OccupiedByTenant|OccupiedByOwner|Vacant)$/: VerticalField(Dropdown),
  
  //  /^home\.propertyUse\.rental\.(adultTenants|tenantsUnder21|numberOfUnrelatedTenants)$/:
  //  VerticalField(NumberInput),

}

// prettier-ignore
export const TYPE_HANDLERS: Record<Node['kind'], any> = {
  'text': Text,
  'select': Select,
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
