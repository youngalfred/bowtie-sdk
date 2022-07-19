import { InputNode, Select, Field } from "src/types"
import { assignModifierToFieldsWithPrefix, BaseConverter } from "."
import { makeTestId } from "./groups"

const getCheckValue = (value: string, optionName: string) => (
    value === optionName ? '1' : ''
)
const handleCheckChange = (value: string, onChange: (value: string) => void) => () =>
    onChange(value)

const toCheckGroup: BaseConverter<InputNode, InputNode[]> = (node) => {
    const { options, label, ...rest } = node as Select
    return options.map(({ name }) => ({
        ...rest,
        label: '',
        value: getCheckValue(node.value, name),
        testId: makeTestId(`${node.testId}-${name}`),
        id: `${node.id}-${name}`,
        kind: 'check',
        onChange: handleCheckChange(name, node.onChange),
    }))
}

const toCheck: BaseConverter<InputNode, InputNode> = (node: InputNode): Field => ({
    ...node,
    value: getCheckValue(node.value, 'yes'),
    label: '',
    onChange: handleCheckChange('yes', node.onChange),
    kind: 'check'
})

type FieldConverter = BaseConverter<InputNode, InputNode|InputNode[]>
export const modifierMap: Record<string, FieldConverter> = {
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

const modifyWindMitField = (node: InputNode) => {
    const converter = modifierMap[node.id]
    const { label, ...rest } = node
    return converter?.(node) || { ...rest, label: '' }
}

export default modifyWindMitField