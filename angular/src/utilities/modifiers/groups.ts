import { OptionType, SelectField } from "@youngalfred/bowtie-sdk";
import { InputNode, Fieldgroup, Node } from "src/types";
import { BaseConverter } from ".";

// The tests expect "-" separating words instead of "."s
export const makeTestId = (id: string) => id.replace(/\./g, "-");

const toRadioGroup = (fg: Fieldgroup): Fieldgroup => ({ // Transform the select question to a radio button group
    ...fg,
    // Should just be one child to reduce (ex: "house-type" and "construction-type")
    // but around 10 select options contained in that single child;
    children: fg.children.reduce((acc: Node[], field: Node): Node[] => {
        const { options = [] } = field as Pick<SelectField, "options">;
        // Make radio buttons out of the select question's options
        return [...acc, ...options.map((option: OptionType, idx: number) => {
            return {
                ...field,
                id: `${field.id}.${option.name}`,
                label: option.label,
                kind: "radio",
                option: option,
                testId: makeTestId(`${field.id}.${idx + 1}`),
            };
        }) as InputNode[]];
    }, [])
});


export const uniqueFGs: Record<string, (fg: Fieldgroup) => Fieldgroup> = {
    "house-type": toRadioGroup,
    "construction-type": toRadioGroup,
}

export const modifyFieldGroup = (fg: Fieldgroup) => {
    const converter = uniqueFGs[fg.id]
    return converter?.(fg) || fg
}


