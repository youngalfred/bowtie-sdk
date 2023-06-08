import React from "react";
import HtmlReactParser from "html-react-parser";
import { m } from "../utils";
import type { Props } from "../props";

export const Text: React.FC<Props> = ({ node, update }) => {
    const handleChange = (event) => update(node.id, event.target.value);
    const { label } = node;

    return (
        <label>
            <h4>{HtmlReactParser(label)}</h4>
            <input type="text" value={node.value} onChange={handleChange} data-automation-id={m(node.id)} />
        </label>
    );
};

export default Text;
