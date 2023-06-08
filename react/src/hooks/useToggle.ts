import React from "react";

export type ToggleType = [boolean, () => undefined];
export const useToggle = (startState = false): ToggleType => {
    const [state, setState] = React.useState(startState);
    const toggle = React.useCallback(() => setState((oldState) => !oldState), []);
    return [state, toggle];
};
