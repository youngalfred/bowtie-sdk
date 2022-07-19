const { assignModifierToFieldsWithPrefix } = require("./shared");

const getCheckValue = (value, optionName) => (
    value === optionName ? '1' : ''
)

const handleCheckChange = (value, onChange) =>
    () => onChange(value);

const withoutLabel = (node) => ({ ...node, label: '' });

const toCheckGroup = (node) => {
    const { options, label, ...rest } = node
    return options.map(({ name }) => withoutLabel({
        ...rest,
        label: '',
        value: getCheckValue(node.value, name),
        id: `${node.id}-${name}`,
        kind: 'check',
        onChange: handleCheckChange(name, node.onChange),
    }))
}


const toCheck = (node) => withoutLabel({
    ...node,
    label: '',
    value: getCheckValue(node.value, 'yes'),
    kind: 'check',
    onChange: handleCheckChange('yes', node.onChange),
})

const modifierMap = {
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

const modifyWindMitField = (node) => {
    const converter = modifierMap[node.id]
    return converter?.(node) || withoutLabel(node)
}

module.exports = {
    modifyWindMitField
}