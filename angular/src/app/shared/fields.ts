import { FieldGroup, FieldType } from "@youngalfred/bowtie-sdk";
import { AppField } from "src/types";

export const makeClasses = ({ valid, classes = [], ...rest }: FieldType, highlightErrors = false) => {
    const { children = [] } = rest as FieldGroup;
    const invalidChildReducer = (acc: boolean, child: FieldType) => {
        if (acc) return true;

        const { children = [] } = child as FieldGroup;
        if (children.length) children.reduce(invalidChildReducer, acc);

        // find first invalid child
        return !child.valid.valid
    };
    const aChildIsInvalid = highlightErrors && children.reduce(invalidChildReducer, false);

    const errorClass = aChildIsInvalid || (highlightErrors && !valid?.valid) ? ["invalid"] : [];

    return [...classes, ...errorClass].join(' ');
};

export const emptyField: AppField = {
    id: "",
    classes: "",
    kind: "",
    value: "",
    label: "",
    valid: { valid: false, msg: "This field should not be empty" },
    placeholder: "",    // A placeholder if the input has not been handled.
    options: [],  // Options for enumerated / listed values.
    onChange: (_: string) => { },  // The event handler.
};