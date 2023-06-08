import React from "react";
import HtmlReactParser from "html-react-parser";
import { m } from "../utils";
import type { Props } from "../props";

export const Checkbox: React.FC<Props> = ({ node, update }) => {
    const handleChange = (event) => update(node.id, node.value === "1" ? "" : "1");
    const checked = node.value === "1" ? { checked: true } : {};
    const { label } = node;
    const mid = m(node.id);

    return (
        <label>
            <h4>{HtmlReactParser(label)}</h4>
            <input type="checkbox" {...checked} onChange={handleChange} data-automation-id={mid} />
        </label>
    );
};

export default Checkbox;
