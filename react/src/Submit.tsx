import React from "react";
import { Portfolio } from "@youngalfred/bowtie-sdk";

type Props = { application: Portfolio };

export const SubmitButton: React.FC<Props> = ({ application }) => {
    const [submitted, setSubmitted] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);
    const portfolioId = React.useRef("");
    const setSubmit = () => setSubmitted((old) => true);
    const setComplete = () => setCompleted((old) => true);
    const payload = application.payload;

    React.useEffect(() => {
        if (completed) {
            return;
        }

        const submit = async () => {
            const response = await fetch("/portfolio/submit", {
                method: "POST",
                body: JSON.stringify({ data: payload }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log(result);
            portfolioId.current = result.portfolioId;
            const validationDetails = {
                valid: result.kind === "success",
                errors: result.errors
                    ? result.errors.map((r) => ({
                          field: r.field,
                          path: r.path,
                          title: r.title,
                          details: r.detail,
                      }))
                    : [],
            };
            console.log(validationDetails);
            setComplete();
        };
        submit();
    }, [submitted, completed, payload]);

    if (completed) {
        return <h3 id="success-message">Your application has successfully been sent</h3>;
    }

    return (
        <button type="button" onChange={setSubmit} id="ya-submit-button">
            Submit Application
        </button>
    );
};

export default SubmitButton;
