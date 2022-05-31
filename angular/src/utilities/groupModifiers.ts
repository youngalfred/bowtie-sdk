import { OptionType, SelectField } from '@youngalfred/bowtie-sdk';
import { AppField, AppFieldGroup, GroupOrField } from 'src/types';

// The tests expect "-" separating words instead of "."s
export const makeTestId = (id: string) => id.replace(/\./g, '-');

const toRadioGroup = (fg: AppFieldGroup): AppFieldGroup => ({ // Transform the select question to a radio button group
    ...fg,
    // Should just be one child to reduce (ex: "house-type" and "construction-type")
    // but around 10 select options contained in that single child;
    children: fg.children.reduce((acc: GroupOrField[], field: GroupOrField): GroupOrField[] => {
        const { options = [] } = field as Pick<SelectField, 'options'>;
        // Make radio buttons out of the select question's options
        return [...acc, ...options.map((option: OptionType, idx: number) => {
            return {
                ...field,
                id: `${field.id}.${option.name}`,
                label: option.label,
                kind: 'radio',
                options: [option],
                testId: makeTestId(`${field.id}.${idx + 1}`),
            };
        }) as AppField[]];
    }, [] as AppField[])
});


export const uniqueFGs: Record<string, (fg: AppFieldGroup) => AppFieldGroup> = {
    'house-type': toRadioGroup,
    'construction-type': toRadioGroup,
    'policy-type': toRadioGroup,
}