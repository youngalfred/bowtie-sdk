const modifyNode = require(".");
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

const modifierMap = {
    'wind-mitigation-fl': flattenChildren(modifyWindMitField)
}

const modifyFieldGroup = (node) => {
    const converter = modifierMap[node.id]
    return converter?.(node) || node
}

module.exports = {
    modifyFieldGroup
}