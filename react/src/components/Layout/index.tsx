import * as React from "react";
import { Fieldgroup } from "../Elements/Fieldgroup";

type Props = { nodes: Fieldgroup[]; update: (_0: string, _1: string) => void };

export const Layout: React.FC<Props> = ({ nodes, update }) => (
    <>
        {nodes.map((child) => (
            <div className="fieldset" key={child.id}>
                <Fieldgroup node={child} update={update} />
            </div>
        ))}
    </>
);

export default Layout;
