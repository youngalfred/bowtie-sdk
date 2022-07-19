const assignModifierToFieldsWithPrefix = (idPrefix, modifier) =>
    (...fieldnames) => (
        fieldnames.reduce((acc, next) => ({
            ...acc,
            [`${idPrefix}${next}`]: modifier
        }), {})
    );

module.exports = {
    assignModifierToFieldsWithPrefix,
}