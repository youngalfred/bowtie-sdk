import { OptionType, SelectField } from "@youngalfred/bowtie-sdk";
import { AppField, AppFieldGroup, GroupOrField } from "src/types";

// The tests expect "-" separating words instead of "."s
export const makeTestId = (id: string) => id.replace(/\./g, "-");

export const uniqueFGs: Record<string, (fg: AppFieldGroup) => AppFieldGroup> = {
    "house-type": (fg: AppFieldGroup): AppFieldGroup => ({ // Transform the select question to a radio button group
        ...fg,
        // Should just be one child to reduce for "house-type" (but around 10 select options contained in that single child);
        children: fg.children.reduce((acc: GroupOrField[], field: GroupOrField): GroupOrField[] => {
            const { options = [] } = field as Pick<SelectField, "options">;
            // Make radio buttons out of the select question's options
            return [...acc, ...options.map((option: OptionType, idx: number) => {
                const radioId = `${field.id}.${idx + 1}`;
                return {
                    ...field,
                    id: radioId,
                    label: option.label,
                    kind: "radio",
                    options: [option],
                    testId: makeTestId(radioId),
                };
            })];
        }, [] as AppField[])
    }),
}