import { DECORATORS } from "@/decorators/question-images";
// import type { PortfolioStore } from "@/store/portfolio";
import type { Node, Fieldgroup, SDKField, SDKFieldGroup, SDKInputField} from '@/types'
import { modifyFieldGroup } from './group-modifiers'
import { modifyField } from './field-modifiers'


// Filter out any questions that shouldn't be rendered
// and add event handlers to the individual fields
export const makeFieldGroups = (
  fields: SDKFieldGroup[],
  store: any,
  inReview: boolean,
) => {
  let groupDecorations: Record<string,string> = {}
    const propsReducer = (acc: Node[], child: SDKField): Node[] => {
        // Do not render prefilled or hidden fields
        if (child.kind === "hidden") {
          return acc;
        }
    
        const { kind, children = [], valid: { valid, msg: warning }, ...groupRest } = child as SDKFieldGroup;
        // reduce the multigroup/fieldgroup's children (they need an onChange event handler and stringified classes)
        if (["multigroup", "fieldgroup"].includes(kind)) {
          groupDecorations = DECORATORS[groupRest.id] || groupDecorations
          // console.log({ id: groupRest.id, decorationsSize: Object.keys(groupDecorations).length })
          return [
            ...acc,
            modifyFieldGroup({
                ...groupRest,
                subtitle: '',
                info: '',
                key: '',
                warning: inReview ? warning : '',
                valid,
                kind: 'fieldgroup',
                children: children.reduce(propsReducer, [])
            })];
        }
    
        const { id, ...rest } = child as SDKInputField;

        if (rest.kind === 'hidden') {
            throw new Error('Unexpected type hidden. Should have been filtered out already.')
        }

        // console.log({groupDecorations, id: id.split('.').pop(), fullid: id })
        const idParts = id.split(".")
        let target = idParts.pop()
        if (target === 'hasUpdate') {
          target = idParts.pop()
        }
        return [
          ...acc,
          modifyField({
            ...rest,
            id,
            placeholder: '',
            subtitle: '',
            info: '',
            decoration: groupDecorations[target || ''] || '',
            key: '',
            warning: inReview ? warning: '',
            valid,
            onChange: store.updateField(id),
          }, store)
        ];
      };

      return fields.reduce(propsReducer, [] as Fieldgroup[]);
    };