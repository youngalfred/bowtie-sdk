import { DECORATORS } from '@/decorators/question-images';
import type { Fieldgroup, Node, SDKOptionType, Select } from '@/types';
import modifyField from './field-modifiers';
import { assignModifierToFieldsByPrefixes, makeDefaultConverter, toCardGroup, type BaseConverter, type InterrimConverter } from './shared-modifiers';

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

/**
 * The purpose of this function is to move a child from its
 * current level (of nesting) n, to level n + 1, and it also
 * requires a new id for the replaced child. Any children omitted 
 * from the childrenMap are untouched and returned in their original form.
 * 
 * @param childrenMap an object mapping { currentId: newId }
 * @returns the same field group as was provided but with re-arranged children,
 * according to the childrenMap argument.
 */
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
                    valid: field.valid && node.valid,
                    warning: field.warning,
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

const toGridGroup: FieldGroupConverter = (converter = defaultConverter) => (node: Fieldgroup): Node => converter({
    ...node,
    renderer: 'grid-group',
})

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
    'occupants': toGridGroup(),
    'start-name': toGridGroup(),
    'start-address-n': toGridGroup(),
    'extra-coverages': toGridGroup(),
    'extras': toGridGroup(),
    'pets': toGridGroup(),
    'valuables': toGridGroup(),
    'any-updates': toGridGroup(),
    'secondary-months-occupied': toGridGroup(),
    'primary-heat-source': regroupChildren({
        // current id: new id
        'home.heating.primarySource': 'home-heat-primary-source'
    })(),
    'home-heat-primary-source': toGridRadioGroup,
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
    'none-updated': toCardGroup(),
    'heating-updated': toCardGroup(),
    'roof-updated': toCardGroup(),
    'electrical-updated': toCardGroup(),
    'waterHeater-updated': toCardGroup(),
    'plumbing-updated': toCardGroup(),
    ...assignModifierToFieldsByPrefixes(toCardGroup())(
        [
            'occupants-',
            [
                'adults',
                'children',
                'tenants',
                'otherFamilies'
            ]
        ],
        [
            'pets-n-',
            [
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
            ]
        ],
    [
        'valuables-',
        [
            'none',
            'jewelry',
            'fur',
            'photoVideoEquipment',
            'musicalInstruments',
            'arts',
            'silverware',
            'golfEquipment',
            'postageStamps',
            'coins',
            'firearms',
            'computerEquipment'
        ]
    ],
    )
}

export const modifyFieldGroup = (node: Fieldgroup) => {
    const converter = modifierMap[node.id]
    return converter?.(node) || node
}

export default modifyFieldGroup