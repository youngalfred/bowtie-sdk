import React from "react";
import HtmlReactParser from "html-react-parser";
import { m } from "../utils";
import type { Props } from "../props";

export const Select: React.FC<Props> = ({ node, update }) => {
    const handleChange = (event) => update(node.id, event.target.value);
    const options = node.value === "" ? [{ name: "", label: "" }, ...node.options] : node.options;
    const { label } = node;

    return (
        <label>
            <h4>{HtmlReactParser(label)}</h4>
            <select value={node.value} onChange={handleChange} data-automation-id={m(node.id)}>
                {options.map(({ name, label }) => (
                    <option value={name} key={`${node.id}-${name}`}>
                        {label}
                    </option>
                ))}
            </select>
        </label>
    );
};

export default Select;
