import Portfolio, { FieldType } from "@youngalfred/bowtie-sdk";

export interface Application {
    portfolio: Portfolio;
    currentSection: number;
    currentFieldgroup: string;
    isSubmitted: boolean;
    isInReview: boolean;
    partner: string;
    sessionId: string;
    nextSectionSelected: boolean;
}

export type OptionType = {
    name: string;
    label: string;
};

export type AppField = {
    kind: string; // Essentially, the type of field (select, text, check, fieldgroup, multigroup)
    value: string; // The field's value
    classes: string; // A string of classes to assist the UI. Ex: phone number fields' classes => "input-phone ..."
    placeholder?: string;    // A placeholder if the input has not been handled.
    options?: OptionType[];  // Options for enumerated / listed values.
    onChange: (_: string) => void;  // The event handler.
    testId?: string;
} & Pick<FieldType, "valid" | "kind" | "id" | "label">;

export type AppFieldGroup = {
    children: (AppFieldGroup | AppField)[];
} & Pick<AppField, "kind" | "valid" | "id" | "label" | "classes">;