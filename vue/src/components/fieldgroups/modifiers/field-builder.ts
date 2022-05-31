import { DECORATORS, defaultDecorator, type DecorationRecord } from "@/decorators/question-images";
import type { Node, Fieldgroup, SDKField, SDKFieldGroup, SDKInputField} from '@/types'
import { stringifyQuery } from "vue-router";
import modifyFieldGroup from '.';


// Filter out any questions that shouldn't be rendered
// and add event handlers to the individual fields
export const makeFieldGroups = (
  fields: SDKFieldGroup[],
  updateField: (field: string) => (value: string) => void,
  inReview: boolean
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
          console.log({ id: groupRest.id, groupDecorations })
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

        console.log({groupDecorations, id: id.split('.').pop() })
        return [
          ...acc,
          {
            ...rest,
            id,
            placeholder: '',
            subtitle: '',
            info: '',
            decoration: groupDecorations[id.split(".").pop() || ''] || '',
            key: '',
            warning: inReview ? warning: '',
            valid,
            onChange: updateField(id),
          }
        ];
      };

      return fields.reduce(propsReducer, [] as Fieldgroup[]);
    };