const assignModifierToFieldsWithPrefix =
  (idPrefix, modifier) =>
  (...fieldnames) =>
    fieldnames.reduce(
      (acc, next) => ({
        ...acc,
        [`${idPrefix}${next}`]: modifier,
      }),
      {},
    )

// Bowtie uses a JSON-driven dotted format for its naming scheme.
// This function turns the dotted fieldnames of the Bowtie input
// objects into dashed names suitable to HTML and CSS.
function m(s) {
  return s.replace(/\./g, '-')
}

const withMungedId = node => ({
  ...node,
  mid: m(node.modifiedId || node.id),
})

module.exports = {
  assignModifierToFieldsWithPrefix,
  withMungedId,
}
