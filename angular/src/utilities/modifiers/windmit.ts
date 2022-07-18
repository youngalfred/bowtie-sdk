import { InputNode, Select, Field } from "src/types"
import { assignModifierToFieldsWithPrefix, BaseConverter } from "."

const toCheckGroup: BaseConverter<InputNode, InputNode[]> = (node) => {
    const { options, label, ...rest } = node as Select
    return options.map(({ name }) => ({
        ...rest,
        label: '',
        value: node.value === name ? '1' : '',
        id: `${node.id}-${name}`,
        kind: 'check',
        onChange: () => node.onChange(name),
    }))
}

const toCheck: BaseConverter<InputNode, InputNode> = (node: InputNode): Field => ({
    ...node,
    label: '',
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