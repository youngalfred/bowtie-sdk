import React from "react";
import { Portfolio } from "@youngalfred/bowtie-sdk";

type Props = { application: Portfolio };

export const SubmitButton: React.FC<Props> = ({ application }) => {
    const [submitted, setSubmitted] = React.useState(false);
    const [completed, setCompleted] = React.useState(false);
    const portfolioId = React.useRef("");
    const setSubmit = () => setSubmitted((old) => true);
    const setComplete = () => setCompleted((old) => true);

    React.useEffect(() => {
        if (completed) {
            return;
        }

        const submit = async () => {
            const response = await fetch("/portfolio/submit", {
                method: "POST",
                body: JSON.stringify({ data: portfolio.payload }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
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
    }, [submitted, completed]);

    if (submitted) {
        return <h3>Your application has been successfully submitted.</h3>;
    }

    return <button onChange={setSubmit}>Submit Application</button>;
};

export default SubmitButton;
