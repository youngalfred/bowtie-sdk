import { DECORATORS } from "@/decorators/question-images";
import type { Fieldgroup, Node, SDKOptionType, Select } from "@/types";

const toRadioGroup = (fg: Fieldgroup): Node => ({ // Transform the select question to a radio button group
    ...fg,
    label: fg.children.length === 1
        ? fg.label || fg.children?.[0].label
        : fg.label,
    children: fg.children.reduce((acc: Node[], field: Node): Node[] => {
        const { options = [] } = field as Select
        // Make radio buttons out of the select question's options
        return [...acc, ...options.map((option: SDKOptionType) => {
            console.log({fg: field.id, id: option.name, dec: DECORATORS[field.id]})
            return {
                ...field,
                id: `${field.id}.${option.name}`,
                decoration: DECORATORS[field.id.split('.').pop() || '']?.[option.name],
                label: option.label,
                kind: "radio",
                option,
            };
        }) as Node[]]
    }, [] as Node[])
})

const regroupChildren = (childrenMap: Record<string, string>) => (node: Fieldgroup): Fieldgroup => ({
    ...node,
    children: node.children.reduce((acc: Node[], field: Node) => {
        const newFgId = childrenMap[field.id]
        if (!newFgId) {
            return [...acc, field]
        }

        const idxOfGroup = acc.findIndex(({id}) => id === newFgId)
        if (idxOfGroup === -1) {
            return [
                ...acc,
                modifyFieldGroup({
                    id: newFgId,
                    kind: 'fieldgroup',
                    label: field.label,
                    valid: field.valid,
                    warning: '',
                    subtitle: '',
                    info: '',
                    key: '',
                    classes: [],
                    children: [
                        field
                    ]
                })
            ]
        }

        const fg = acc[idxOfGroup] as Fieldgroup
        return [
            ...acc.slice(0, idxOfGroup),
            modifyFieldGroup({
                ...fg,
                children: [
                    ...fg.children,
                    field
                ]
            }),
            ...acc.slice(idxOfGroup+1)
        ] as Node[]
    }, [] as Node[])
}) 

const modifyFieldGroup = (node: Fieldgroup) => {
    const modifierMap: Record<string, (fg: Fieldgroup) => Node> = {
        "house-type": toRadioGroup,
        "construction-type": toRadioGroup,
        "policy-type": toRadioGroup,
        "gender": toRadioGroup,
        "property-type": toRadioGroup,
        "add-secondary-policy-holder": toRadioGroup,
        "get-started": regroupChildren({
            'start.firstName': 'start-name',
            'start.lastName': 'start-name',
            'start.streetAddress': 'start-address-1',
            'start.unit': 'start-address-1',
            'start.city': 'start-address-2',
            'start.state': 'start-address-2',
            'start.zipCode': 'start-address-2',
        }),
        "secondary-policy-holder": regroupChildren({
            'home.secondaryPolicyHolder': 'add-secondary-policy-holder'
        })
    }

    const converter = modifierMap[node.id]
    node.id === 'get-started' && console.log(converter?.(node))
    return converter?.(node) || node
}

export default modifyFieldGroup