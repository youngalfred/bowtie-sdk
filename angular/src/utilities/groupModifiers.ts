import { OptionType, SelectField } from "@youngalfred/bowtie-sdk";
import { AppField, AppFieldGroup, GroupOrField } from "src/types";

// The tests expect "-" separating words instead of "."s
export const makeTestId = (id: string) => id.replace(/\./g, "-");

type CastedKind = "radio"|"check";
const changeSelectFieldKind = (field: AppField, newKind: CastedKind): AppField[] => {
    const { options = [] } = field as Pick<SelectField, "options">;
    // Make radio buttons out of the select question's options
    return options.map((option: OptionType, idx: number) => {
        return {
            ...field,
            id: `${field.id}.${option.name}`,
            label: option.label,
            kind: newKind,
            options: [option],
            testId: makeTestId(`${field.id}.${idx + 1}`),
        };
    }) as AppField[];
};

const changeGroupChildrenKind = (newKind: CastedKind) => (fg: AppFieldGroup): AppFieldGroup => ({ // Transform the select question to a radio button group
    ...fg,
    // Should just be one child to reduce (ex: "house-type" and "construction-type")
    // but around 10 select options contained in that single child;
    children: fg.children.reduce((acc: GroupOrField[], field: GroupOrField): GroupOrField[] => {
        // Make radio buttons out of the select question's options
        return [...acc, ...changeSelectFieldKind(field as AppField, newKind)];
    }, [] as AppField[])
});

const changeToRadioGroup = changeGroupChildrenKind("radio");

export const uniqueFGs: Record<string, (fg: AppFieldGroup) => AppFieldGroup> = {
    "house-type": changeToRadioGroup,
    "construction-type": changeToRadioGroup,
    "wind-mitigation-fl-opening-protection-glazed": (fg) => {
        const [ firstChild, ...otherChildren ] = fg.children;
        fg.children = [firstChild];
        const updatedFG = changeToRadioGroup(fg);
        updatedFG.children = [...updatedFG.children, ...otherChildren];
        return updatedFG;
    },
}