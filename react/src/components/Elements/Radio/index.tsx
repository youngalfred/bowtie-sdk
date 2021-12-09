import React from "react";
import HtmlReactParser from "html-react-parser";
import { m } from "../utils";
import type { Props } from "../props";

export const Radio: React.FC<Props> = ({ node, update }) => {
    const handleClick = (name: string) => (event) => {
        event.preventDefault();
        event.stopPropagation();
        update(node.id, name);
    };

    const { label } = node;

    return (
        <label>
            <h4>{HtmlReactParser(label)}</h4>
            <ul>
                {node.options.map(({ name, label }, index) => (
                    <li key={`${node.id}-${name}`} onClick={handleClick(name)}>
                        <input
                            name={m(node.id)}
                            type="radio"
                            value={name}
                            onChange={handleClick(name)}
                            data-automation-id={`${m(node.id)}-${index}`}
                            {...((name === node.value && { checked: true }) || {})}
                        />
                        &nbsp;
                        {label}
                    </li>
                ))}
            </ul>
        </label>
    );
};

export default Radio;
