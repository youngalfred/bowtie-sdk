import { FieldType } from "@youngalfred/bowtie-sdk";
import { Field } from "src/types";

export const makeClasses = (field: Field | FieldType, highlightErrors = false) => {
    const errorClass = highlightErrors && !field.valid?.valid ? ["invalid"] : [];
    return [...(field.classes || []), ...errorClass].join(' ');
};

export const emptyField = {
    id: "",
    classes: [],
    kind: "",
    value: "",
    label: "",
    placeholder: "",    // A placeholder if the input has not been handled.
    options: [],  // Options for enumerated / listed values.
    onChange: (_: string) => { },  // The event handler.
    onFocus: (_: boolean) => { } // The event handler
};