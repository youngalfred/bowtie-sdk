const { assignModifierToFieldsWithPrefix, withMungedId } = require('./shared')

const getCheckValue = (value, optionName) => (value === optionName ? '1' : '')

const withoutLabel = node => ({ ...node, label: '' })

const toCheckGroup = node => {
  const { options, label, ...rest } = node
  return options.map(({ name }) =>
    withMungedId(
      withoutLabel({
        ...rest,
        kind: 'check',
        value: getCheckValue(node.value, name),
        modifiedId: `${node.id}-${name}`,
        onChange: () => Promise.resolve(name),
      }),
    ),
  )
}

const toCheck = node =>
  withMungedId(
    withoutLabel({
      ...node,
      kind: 'check',
      value: getCheckValue(node.value, 'yes'),
      // Allow the checkbox to be unchecked
      onChange: () => Promise.resolve(node.value === 'yes' ? 'no' : 'yes'),
    }),
  )

const modifierMap = {
  ...assignModifierToFieldsWithPrefix('home.windmit.', toCheckGroup)(
    'buildingCode',
    'roofCovering',
    'roofDeckAttachment',
    'roofToWallAttachment',
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

const modifyWindMitField = node => {
  const converter = modifierMap[node.id]
  return converter?.(node) || withMungedId(withoutLabel(node))
}

module.exports = {
  modifyWindMitField,
}
