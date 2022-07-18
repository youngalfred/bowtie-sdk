import { assignModifierToFieldsWithPrefix, type BaseConverter } from "@/modifiers/shared-modifiers"
import type { InputNode, Field, Select } from "@/types"

const getCheckValue = (value: string, optionName: string) => (
    value === optionName ? '1' : ''
)
const handleCheckChange = (value: string, onChange: (value: string) => void) => () =>
    onChange(value)

const toCheckGroup: BaseConverter<InputNode, Field[]> = (node) => {
    const { options, label, ...rest } = node as Select
    return options.map(({ name }) => ({
        ...rest,
        label: '',
        value: getCheckValue(node.value, name),
        id: `${node.id}-${name}`,
        kind: 'check',
        onChange: handleCheckChange(name, node.onChange),
    }))
}

const toCheck: BaseConverter<InputNode, Field> = (node) => ({
    ...node,
    label: '',
    value: getCheckValue(node.value, 'yes'),
    kind: 'check',
    onChange: handleCheckChange('yes', node.onChange),
})

type FieldConverter = BaseConverter<InputNode, InputNode|InputNode[]>
const modifierMap: Record<string, FieldConverter> = {
    ...assignModifierToFieldsWithPrefix(
        'home.windmit.',
        toCheckGroup
    )(
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
    'home.windmit.roofCoveringType-concreteOrClayTile-NoInfo': toCheck,
    'home.windmit.roofCoveringType-builtUp-NoInfo': toCheck,
    'home.windmit.roofCoveringType-membrane-NoInfo': toCheck,
    'home.windmit.roofCoveringType-asphaltOrFiberglassShingle-NoInfo': toCheck,
    'home.windmit.roofCoveringType-metal-NoInfo': toCheck,
    'home.windmit.roofCoveringType-other-NoInfo': toCheck,
}

export const modifyWindMitField = (node: InputNode) => {
    const converter = modifierMap[node.id]
    const { label, ...rest } = node
    return converter?.(node) || { ...rest, label: '' }
}

export default modifyWindMitField
