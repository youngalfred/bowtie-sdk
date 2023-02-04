import type { FileInput, InputNode } from 'src/types'
import { makeDefaultConverter, BaseConverter, InterrimConverter } from '.'

const defaultConverter = makeDefaultConverter<InputNode>()
type FieldConverter = InterrimConverter<BaseConverter<InputNode, InputNode>>
type FieldAdditions = {
  uploadFiles: FileInput['uploadFiles']
}

type FieldWithoutAdditions = Omit<InputNode, 'uploadFiles'>

const toFileUploader: FieldConverter =
  (converter = defaultConverter) =>
  (node, additions) =>
    converter(
      {
        ...node,
        kind: 'file', // this node was already of kind file, but TS doesn't know that
        uploadFiles: (files: File[]) => additions.uploadFiles(files),
      },
      additions,
    )

const idModifierMap: Record<string, BaseConverter<InputNode, InputNode>> = {
  // ...
}

const kindModifierMap: Partial<Record<InputNode['kind'], BaseConverter<InputNode, InputNode>>> = {
  file: toFileUploader(),
}

const idRgx = /\.(\d+)\./
export const modifyField = (node: FieldWithoutAdditions, additionals: FieldAdditions) => {
  const standardId = node.id.replace(idRgx, '.n.')
  const converter = idModifierMap[standardId] || kindModifierMap[node.kind]
  return converter?.(node as InputNode, additionals) || node
}

export default modifyField
