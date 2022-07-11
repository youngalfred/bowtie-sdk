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
    kind: "text" | "select" | "check" | "file" | "hidden" | "multigroup" | "fieldgroup" | "radio";
    value: string; // The field's value
    classes: string; // A string of classes to assist the UI. Ex: phone number fields' classes => "input-phone ..."
    options?: OptionType[];  // Options for enumerated / listed values.
    onChange: (_: string) => void;  // The event handler.
    testId: string;
    applySideEffect?: () => Promise<void>;
} & Pick<FieldType, "valid" | "id" | "label">;

export type FileField = {
    uploadFiles: (files: File[]) => Promise<{fileName: string; objectId: string}[]>;
} & AppField;

export type AppFieldGroup = {
    children: (AppFieldGroup | AppField)[];
} & Pick<AppField, "kind" | "valid" | "id" | "label" | "classes">;

export type GroupOrField = AppField | AppFieldGroup;