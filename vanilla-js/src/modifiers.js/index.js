const { modifyField } = require("./fields");
const { modifyFieldGroup } = require("./groups");
const { withMungedId } = require("./shared");

const modifyNode = (node) => {
    const { children } = node;

    return withMungedId(
        Array.isArray(children)
            ? modifyFieldGroup(node)
            : modifyField(node)
        );
}

module.exports = modifyNode;