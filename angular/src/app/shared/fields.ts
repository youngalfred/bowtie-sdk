import { FieldGroup, FieldType } from "@youngalfred/bowtie-sdk";
import { AppField } from "src/types";
import classNames from "../decorators/styles"

// return true if at least one of the children is invalid
const invalidChildReducer = (acc: boolean, child: FieldType) => {
    if (acc) return true;

    const { children = [] } = child as FieldGroup;
    if (children.length) children.reduce(invalidChildReducer, acc);

    return !child.valid.valid;
};

export const combineClasses = ({ id, valid, classes = [], ...rest }: FieldType, highlightErrors = false) => {
    const { children = [] } = rest as FieldGroup;
    const decoratorClasses = classNames[id] || [];
    const errorClass = highlightErrors && (
        !valid?.valid || children.reduce(invalidChildReducer, false)
    ) ? ["invalid"] : [];

    return [...classes, ...decoratorClasses, ...errorClass].join(' ');
};

export const emptyField: AppField = {
    id: "",
    classes: "",
    kind: "",
    value: "",
    label: "",
    valid: { valid: false, msg: "This field should not be empty" },
    options: [],
    onChange: (_: string) => { },
};