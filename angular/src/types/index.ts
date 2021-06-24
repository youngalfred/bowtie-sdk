import Portfolio from "@youngalfred/bowtie-sdk";

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

export interface Field {
    id: string;              // The field id as sent from the SDK.
    classes?: string[];      // Classes to distinguish the field's hierarchy; also offers more specific information beyond the "kind"
    value: string;           // The value as sent from the SDK
    kind: string;            // The type of field, which is relevant for knowing how to render the field
    label?: string;          // The actual question.
    placeholder?: string;    // A placeholder if the input has not been handled.
    options?: OptionType[];  // Options for enumerated / listed values.
    onChange: (_: string) => void;  // The event handler.
    onFocus?: (_: boolean) => void;  // A handler for focus events.
    valid?: { valid: boolean; msg?: string; }; // whether or not the field is valid, and a validation message
}

export type FieldGroup = {
    children: Field[];
};