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
    id: string;              // The field value as sent from the SDK.
    value: string;           // The value as sent from the SDK
    kind: string;
    label?: string;          // The actual question.
    placeholder?: string;    // A placeholder if the input has not been handled.
    options?: OptionType[];  // Options for enumerated / listed values.
    onChange: (_: string) => void;  // The event handler.
    onFocus?: (_: boolean) => void;  // A handler for focus events.
}

export type FieldGroup = {
    children: Field[];
};

// Ideally, this would be in some shared folder (so that both the text and select fields can use it) 
// instead of the types file
export const emptyField = {
    id: "",
    kind: "",
    value: "",
    label: "",
    placeholder: "",    // A placeholder if the input has not been handled.
    options: [],  // Options for enumerated / listed values.
    onChange: (_: string) => { },  // The event handler.
    onFocus: (_: boolean) => { } // The event handler
};