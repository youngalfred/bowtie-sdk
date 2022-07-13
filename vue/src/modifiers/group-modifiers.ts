import { DECORATORS } from '@/decorators/question-images';
import type { Fieldgroup, Node, SDKOptionType, Select } from '@/types';
import modifyField from './field-modifiers';
import { makeDefaultConverter, toCardGroup, type BaseConverter, type InterrimConverter } from './shared-modifiers';

const defaultConverter = makeDefaultConverter<Fieldgroup>()
type FieldGroupConverter = InterrimConverter<BaseConverter<Fieldgroup, Node>>

const toRadioGroup: FieldGroupConverter = (converter = defaultConverter) => (fg: Fieldgroup): Node => converter({ // Transform the select question to a radio button group
    ...fg,
    label: fg.children.length === 1
        ? fg.label || fg.children?.[0].label
        : fg.label,
    warning: fg.children.length === 1
    ? fg.children?.[0].warning
    : fg.warning,
    children: fg.children.reduce((acc: Node[], field: Node): Node[] => {
        const { options = [] } = field as Select
        // Make radio buttons out of the select question's options
        return [...acc, ...options.map((option: SDKOptionType) => {
            return modifyField({
                ...field as Select,
                id: `${field.id}.${option.name}`,
                decoration: DECORATORS[field.id.split('.').pop() || '']?.[option.name],
                label: option.label,
                kind: 'radio',
                option,
                warning: '', // do not show the field's warning on every option
            }, {});
        }) as Node[]]
    }, [] as Node[])
})

const regroupChildren = (childrenMap: Record<string, string>): FieldGroupConverter => (converter = defaultConverter) => (node: Fieldgroup): Node => converter({
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

const toGridGroup: FieldGroupConverter = (converter = defaultConverter) => (node: Fieldgroup): Node => {
    console.log(node);
    return converter({
    ...node,
    renderer: 'grid-group',
})
}

const toGridRadioGroup = toGridGroup(toRadioGroup())

const modifierMap: Record<string, BaseConverter<Fieldgroup, Node>> = {
    'house-type': toGridRadioGroup,
    'construction-type': toGridRadioGroup,
    'policy-type': toGridRadioGroup,
    'gender': toGridRadioGroup,
    'property-type': toGridRadioGroup,
    'add-secondary-policy-holder': toGridRadioGroup,
    'roof-material': toGridRadioGroup,
    'roof-shape': toGridRadioGroup,
    'plan-type': toGridRadioGroup,
    'primary-heat-source': toGridRadioGroup,
    'occupants': toGridGroup(),
    'start-name': toGridGroup(),
    'start-address-n': toGridGroup(),
    'extra-coverages': toGridGroup(),
    'extras': toGridGroup(),
    'pets': toGridGroup(),
    'valuables': toGridGroup(),
    'any-updates': toGridGroup(),
    'secondary-months-occupied': toGridGroup(),
    'get-started': regroupChildren({
        'start.firstName': 'start-name',
        'start.lastName': 'start-name',
        'start.streetAddress': 'start-address-1',
        'start.unit': 'start-address-1',
        'start.city': 'start-address-2',
        'start.state': 'start-address-2',
        'start.zipCode': 'start-address-2',
    })(),
    'secondary-policy-holder': regroupChildren({
        'home.secondaryPolicyHolder': 'add-secondary-policy-holder'
    })(),
    'occupants-adults': toCardGroup(),
    'occupants-children': toCardGroup(),
    'occupants-tenants': toCardGroup(),
    'occupants-otherFamilies': toCardGroup(),
    ...[
        'none',
        'cat',
        'akita',
        'chowChow',
        'doberman',
        'alaskanMalamute',
        'pitBull',
        'rottweiler',
        'staffordshireBullTerrier',
        'germanShepherd',
        'presaCanario',
        'wolfHybrid',
        'husky',
        'otherDogBreed',
        'other',
        'exoticPet'
    ].reduce((acc, next) => ({
        ...acc,
        [`pets-n-${next}`]: toCardGroup()
    }), {}),
    ...[
        'none', 'jewelry', 'fur', 'photoVideoEquipment', 'musicalInstruments', 'arts', 'silverware', 'golfEquipment', 'postageStamps', 'coins', 'firearms', 'computerEquipment'
    ].reduce((acc, next) => ({
        ...acc,
        [`valuables-${next}`]: toCardGroup()
    }), {}),
}

export const modifyFieldGroup = (node: Fieldgroup) => {
    const converter = modifierMap[node.id]
    return converter?.(node) || node
}

export default modifyFieldGroup