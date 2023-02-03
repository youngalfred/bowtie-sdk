import { OptionType, SelectField } from "@youngalfred/bowtie-sdk";
import { DECORATORS } from "src/app/decorators/question-images";
import { InputNode, Fieldgroup, Node } from "src/types";
import { BaseConverter, InterrimConverter, makeDefaultConverter } from ".";

type FieldGroupConverter = InterrimConverter<BaseConverter<Fieldgroup, Fieldgroup>>;

const defaultConverter = makeDefaultConverter<Fieldgroup>();
const withDecoration =
    (converter = defaultConverter) =>
    (node: Fieldgroup): Fieldgroup =>
        converter({
            ...node,
            decoration: DECORATORS[node.id] || {},
        });

// The tests expect "-" separating words instead of "."s
export const makeTestId = (id: string) => id.replace(/\./g, "-");

const toRadioGroup: FieldGroupConverter =
    (converter = defaultConverter) =>
    (node: Fieldgroup): Fieldgroup =>
        converter({
            // Transform the select question to a radio button group
            ...node,
            label: node.label || node.children?.[0]?.label,
            // Should just be one child to reduce (ex: "house-type" and "construction-type")
            // but around 10 select options contained in that single child;
            children: node.children.reduce((acc: Node[], field: Node): Node[] => {
                const { options = [] } = field as Pick<SelectField, "options">;
                // Make radio buttons out of the select question's options
                return [
                    ...acc,
                    ...(options.map((option: OptionType, idx: number) => {
                        return {
                            ...field,
                            id: `${field.id}.${option.name}`,
                            label: option.label,
                            kind: "radio",
                            option: option,
                            testId: makeTestId(`${field.id}.${idx + 1}`),
                        };
                    }) as InputNode[]),
                ];
            }, []),
        });

export const uniqueFGs: Record<string, BaseConverter<Fieldgroup, Fieldgroup>> = {
    "house-type": toRadioGroup(),
    "construction-type": toRadioGroup(),
};

export const modifyFieldGroup = (fg: Omit<Fieldgroup, "decoration">): Fieldgroup => {
    const converter = uniqueFGs[fg.id];
    return withDecoration()(converter?.({ decoration: {}, ...fg }) || fg);
};
