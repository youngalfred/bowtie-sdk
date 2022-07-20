const modifyNode = require(".");
const { modifyField } = require("./fields");
const { modifyWindMitField } = require("./windmit");

const flattenChildren = (fieldModifier = modifyNode) => (fieldgroup) => {

    const flatten = (acc, field) => {
      const { children = [] } = field
      if (children.length) {
          return children.reduce(flatten, acc)
      }
      const modified = fieldModifier(field)
      return acc.concat(Array.isArray(modified) ? modified : [modified])
    }

    return {
        ...fieldgroup,
        children: fieldgroup.children.reduce(flatten, [])
    }
  }

const toRadioGroup = (node) => {
    const selectField = node.children[0];
    return {
        ...node,
        children: [
            ...selectField.options.map(({ name, label }, optionIdx) => modifyField({
                ...selectField,
                kind: 'radio',
                modifiedId: `${selectField.id}-${optionIdx + 1}`,
                option: { name, label }
            })),
            ...node.children.length > 1
                ? [{
                    id: `${node.id}-nested`,
                    kind: 'fieldgroup',
                    label: '',
                    children: node.children.slice(1)
                }]
                : []
        ]
    };
}

const modifierMap = {
    'wind-mitigation-fl': flattenChildren(modifyWindMitField),
    'house-type': toRadioGroup,
    'construction-type': toRadioGroup,
}

const modifyFieldGroup = (node) => {
    const converter = modifierMap[node.id]
    return converter?.(node) || node
}

module.exports = {
    modifyFieldGroup
}