import { DECORATORS } from '@/decorators/question-images'
import type { Node, Fieldgroup, SDKField, SDKFieldGroup, SDKInputField } from '@/types'
import { modifyField } from './field-modifiers'
import { modifyFieldGroup } from './group-modifiers'

const getDecorationTarget = (id: string): string => {
  const idParts = id.split('.')
  const popped = idParts.pop() || ''

  /**
   * There are two field groups where this approach
   * fails to correctly find the desired image decoration:
   * - hasUpdate
   * - hasPets (without this case, there would be duplicate images)
   */
  if (popped === 'hasUpdate') {
    return idParts.pop() || ''
  }
  if (/hasPets/.test(id)) {
    return popped.replace('_', '')
  }

  return popped
}

// Filter out any questions that shouldn't be rendered
// and add event handlers to the individual fields
export const makeFieldGroups = (fields: SDKFieldGroup[], store: any, inReview: boolean) => {
  let groupDecorations: Record<string, string> = {}
  const propsReducer = (acc: Node[], child: SDKField): Node[] => {
    // Do not render prefilled or hidden fields
    if (child.kind === 'hidden') {
      return acc
    }

    const {
      kind,
      children = [],
      valid: { valid, msg: warning },
      ...groupRest
    } = child as SDKFieldGroup
    // reduce the multigroup/fieldgroup's children (they need an onChange event handler and stringified classes)
    if (['multigroup', 'fieldgroup'].includes(kind)) {
      groupDecorations = DECORATORS[groupRest.id] || groupDecorations

      return [
        ...acc,
        modifyFieldGroup({
          ...groupRest,
          subtitle: '',
          info: '',
          key: '',
          warning: inReview ? warning || (valid ? '' : 'A value is required here.') : '',
          valid,
          kind: 'fieldgroup',
          children: children.reduce(propsReducer, []),
        }),
      ]
    }

    const { id, ...rest } = child as SDKInputField

    if (rest.kind === 'hidden') {
      throw new Error('Unexpected type hidden. Should have been filtered out already.')
    }

    const decorationTarget = getDecorationTarget(id)
    const { [id]: override } = store.fieldOverrides

    return [
      ...acc,
      modifyField(
        {
          ...rest,
          id,
          placeholder: '',
          subtitle: '',
          info: '',
          decoration: groupDecorations[decorationTarget] || '',
          key: '',
          warning: inReview ? warning : '',
          valid,
          onChange: store.updateField(id),
          /*
           * Unfortunately, the sdk overrides are lost on each portfolio update;
           * to preserve the sdk's overrides, we keep our own copy in the portfolio store
           * and use those overrides when available (such as the options for an auto's make,
           * model, and body type, etc...)
           */
          ...override,
        },
        store,
      ),
    ]
  }

  return fields.reduce(propsReducer, [] as Fieldgroup[])
}
