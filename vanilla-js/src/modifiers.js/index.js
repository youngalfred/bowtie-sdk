const { modifyField } = require("./fields");
const { modifyFieldGroup } = require("./groups");

const modifyNode = (node) => {
    const { children } = node;

    return Array.isArray(children)
        ? modifyFieldGroup(node)
        : modifyField(node);
}

module.exports = modifyNode;