import { assignModifierToFieldsWithPrefix, type BaseConverter } from '@/modifiers/shared-modifiers'
import type { InputNode, Field, Select } from '@/types'

const getCheckValue = (value: string, optionName: string) => (value === optionName ? '1' : '')

const toCheckGroup: BaseConverter<InputNode, Field[]> = node => {
  const { options, label, ...rest } = node as Select
  return options.map(({ name }) => ({
    ...rest,
    label: '',
    value: getCheckValue(node.value, name),
    id: `${node.id}-${name}`,
    kind: 'check',
    onChange: () => node.onChange(name),
  }))
}

const toCheck: BaseConverter<InputNode, Field> = node => ({
  ...node,
  label: '',
  value: getCheckValue(node.value, 'yes'),
  kind: 'check',
  onChange: () => node.onChange(node.value === 'yes' ? 'no' : 'yes'),
})

type FieldConverter = BaseConverter<InputNode, InputNode | InputNode[]>
const modifierMap: Record<string, FieldConverter> = {
  ...assignModifierToFieldsWithPrefix('home.windmit.', toCheckGroup)(
    'buildingCode',
    'roofCovering',
    'roofDeckAttachment',
    'roofToWallAttachment',
    'minConditionBCDAttached',
    'minConditionBCDSecured',
    'aToeNailsTrussRafter',
    'bClips',
    'dDoubleWraps',
    'roofGeometry',
    'secondaryWaterResistance',
    'openingProtection',
    'openingProtectionA',
    'openingProtectionB',
    'openingProtectionC',
    'openingProtectionN',
  ),
  ...assignModifierToFieldsWithPrefix('home.windmit.', toCheck)(
    'minConditionBCDAttached',
    'minConditionBCDSecured',
  ),
  ...assignModifierToFieldsWithPrefix('home.windmit.roofCoveringType-', toCheck)(
    'concreteOrClayTile-NoInfo',
    'builtUp-NoInfo',
    'membrane-NoInfo',
    'asphaltOrFiberglassShingle-NoInfo',
    'metal-NoInfo',
    'other-NoInfo',
  ),
}

export const modifyWindMitField = (node: InputNode) => {
  const converter = modifierMap[node.id]
  const { label, ...rest } = node
  return converter?.(node) || { ...rest, label: '' }
}

export default modifyWindMitField
