const modifierMap = {
    // any fields you wish to change
}

const modifyField = (node) => {
    const converter = modifierMap[node.id]
    return converter?.(node) || node
}

module.exports = {
    modifyField
}