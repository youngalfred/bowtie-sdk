import React from "react";
import HtmlReactParser from "html-react-parser";
import Portfolio, { FieldType } from "@youngalfred/bowtie-sdk";

import Checkbox from "../Checkbox";
import Radio from "../Radio";
import Select from "../Select";
import Text from "../Text";

import type { Props } from "../props";

const Multigroup: React.FC<Props> = ({ node, update }) => (
    <>{node.children.map((child: FieldType) => Fieldgroup(child, update))}</>
);

const renderers: { string: React.FC<Props> } = {
    hidden: (_node, _update) => null,
    select: (node, update) => <Select node={node} update={update} key={`ya-field-${node.id}`} />,
    text: (node, update) => <Text node={node} update={update} key={`ya-field-${node.id}`} />,
    radio: (node, update) => <Radio node={node} update={update} key={`ya-field-${node.id}`} />,
    check: (node, update) => <Checkbox node={node} update={update} key={`ya-field-${node.id}`} />,
    fieldgroup: (node, update) => <Fieldgroup node={node} update={update} key={`ya-field-${node.id}`} />,
    multigroup: (node, update) => <Multigroup node={node} update={update} key={`ya-field-${node.id}`} />,
};

const toRadio = ["home.propertyStyle", "home.constructionType"];
const intercept = (node: FieldType): string => (toRadio.includes(node.id) ? "radio" : (node.kind as string));

export function Fieldgroup({ node, update }: Props): React.ReactNode {
    return (
        <label>
            {node.label && <h3>{HtmlReactParser(node.label)}</h3>}
            {node.children.map((child: FieldType) => renderers[intercept(child)](child, update))}
        </label>
    );
}

export default Fieldgroup;
