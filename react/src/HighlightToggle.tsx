import React from "react";
import { ToggleType } from "./hooks/useToggle";

type Props = { value: boolean; toggle: () => undefined };

export const HighlightToggle: React.FC<Props> = ({ value, toggle }) => (
    <div>
        <input type="checkbox" {...((value && { checked: true }) || {})} onChange={toggle} /> Highlight
        invalid fields.
    </div>
);

export default HighlightToggle;
