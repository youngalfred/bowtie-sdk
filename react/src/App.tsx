import React from "react";
import { Portfolio } from "@youngalfred/bowtie-sdk";
import { Layout } from "./components/Layout";
import { useToggle } from "./hooks/useToggle";
import { SubmitButton } from "./Submit";
import { HighlightToggle } from "./HighlightToggle";

function maybeLocalStore() {
    try {
        const application = window.sessionStorage.getItem("young_alfred");
        return JSON.parse(application ? application : "{}");
    } catch (e) {
        console.log(e);
        return {};
    }
}

const App: React.FC = () => {
    const [state, setState] = React.useState({ application: new Portfolio(maybeLocalStore()) });
    const [highlighting, toggleHighlighting] = useToggle();

    const update = (id: string, value: string) =>
        setState((prev) => {
            const node = prev.application.find(id);
            prev.application.set(node, value);
            return { ...{ application: prev.application } };
        });

    return (
        <div>
            <h2>Bowtie SDK: React Demo</h2>
            <form>
                <Layout nodes={state.application.view} update={update} />
                {state.application.valid ? (
                    <SubmitButton application={application} />
                ) : (
                    <HighlightToggle value={highlighting} toggle={toggleHighlighting} />
                )}
            </form>
        </div>
    );
};

export default App;
