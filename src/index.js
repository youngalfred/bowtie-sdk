/*
           # The Bowtie SDK: Pure JS Demonstration

           This file contains the basic Bowtie Portfolio demo.  It is written in
           100% ES6 Javascript, and could easily be downgraded to ES5 by re-writing
           the template literals with string concatenation operations. The purpose
           of this demo is to show how one interacts with the Bowtie Portfolio
           object and the Portfolio Application Loop.

           In the Javascript portion of the code, you'll find three functions that
           render input objects of different kinds (text boxes, selection
           drop-downs, and checkboxes), the core function (`renderFieldgroup`) that
           renders groups of questions, and the launch function (`renderPortfolio`)
           that renders the form with every user interaction and connects the event
           managers to the fields of the form.

           The essential activity of the Portfolio is well-described by this demo:
           whenever a drop-down is selected, a checkbox clicked, or a text input
           modified, the Portfolio is updated as new questions are added and
           unnecessary ones removed, and the form is re-rendered.

           Because the Bowtie Portfolio is a dynamic, evolving form with fields
           added or removed as the customer's responses evolve, this demo does not
           correctly handle tabIndex or Aria compliance.  It is intended
           as a technology demonstration and educational example _only_.

           ---

           1. As of version 1.0 of the Bowtie SDK, template literals are
           well-supported by every major browser released after 2015, with the
           exception of Opera Mini.  See: https://caniuse.com/template-literals
*/
const Portfolio = require("@youngalfred/bowtie-sdk").Portfolio;

function maybeLocalstore() {
    try {
        const application = window.sessionStorage.getItem("young_alfred");
        return JSON.parse(application ? application : "{}");
    } catch (e) {
        console.log(e);
        return {};
    }
}

(function () {
    // Build a new portfolio object.
    const portfolio = new Portfolio(maybeLocalstore());

    // When complete, we should get back a valid portfolio ID.
    let portfolioId = null;

    // After a round-trip through your local service, this will be
    // populated with the results of your submission.
    let validationDetails = null;

    // The next two fields are to help keep track of which field the
    // user recently touched.  Normally, a good framework such as
    // React or Vue keeps track of this for us.
    let tabIndex = 0;
    let lastTabEvent = null;

    // If set to true, adds the 'invalid' class to any fieldgroups that
    // are invalid.
    let highlightValidity = false;

    // Utility function to turn the dotted fieldnames of the Bowtie
    // input objects into dashed names suitable to HTML and CSS.
    function m(s) {
        return s.replace(/\./g, "-");
    }

    // Utility function to build a label if necessary.
    function maybeLabel(node) {
        return node.label ? '<label class="label">' + node.label + ": </label>" : "";
    }

    // Render a <select> input object for enumerated fields.
    function renderSelect(node) {
        const mid = m(node.id);
        tabIndex++;

        // The list of enumerated options may need to be
        // modified if the user has not yet interacted
        // with the input object, so we make a shallow copy
        // of the options list (to avoid mutating the
        // original list) and, if necessary, splice in the
        // blank value at the top.

        const options = node.options.map(function (a) {
            return a;
        });

        // A select box with an empty value has not yet been
        // interacted with.  Provide an empty value to
        // emphasize this fact.
        if (node.value === "") {
            options.splice(0, 0, { name: "", label: "" });
        }

        const renderedOptions = options
            .map(function (opt) {
                const selected = node.value !== "" && node.value == opt.name;
                return `<option value="${opt.name}"${selected ? " selected" : ""}>${opt.label}</option>`;
            })
            .join("\n");

        const input = `<select id="${mid}" name="${mid}" tabindex="${tabIndex}">${renderedOptions}</select>`;

        return {
            text: '<div class="question">' + maybeLabel(node) + input + "</div>",
            id: m(node.id),
            node: node,
            events: ["change", "keydown"],
        };
    }

    // Render an <input type="text" ... /> field for free-form input
    function renderText(node) {
        const mid = m(node.id);
        tabIndex++;
        const input = `<input id="${mid}" name="${mid}" value="${node.value}" tabindex="${tabIndex}"/>`;
        return {
            text: '<div class="question">' + maybeLabel(node) + input + "</div>",
            id: m(node.id),
            node: node,
            events: ["blur", "keydown"],
        };
    }

    // Render an <input type="checkbox" ... /> field for boolean input.
    function renderCheck(node) {
        const mid = m(node.id);
        tabIndex++;

        // There's a clever (read: hacky) trick in here.  With every
        // iteration, we either set it to `... checked value=""` or
        // `... value="1"`.  The Bowtie SDK uses "1" for "true" for
        // checked fields, and "" (an empty string) for "false".  By
        // doing this, we can just call the "onClick" event and set
        // the value to whatever the checkbox says the value ought to
        // be.  So a "checked" box becomes unchecked automatically,
        // and vice-versa.  This does mean that the _value_ of the
        // checkbox and its checked state are the opposite of what an
        // HTML Form expects, but Bowtie isn't an HTML Form.

        const checked = node.value === "1" ? 'value="" checked' : 'value="1"';
        const input = `<input type="checkbox" id="${mid}" name="${mid}" ${checked} tabindex="${tabIndex}" />`;

        return {
            text: '<div class="question">' + maybeLabel(node) + input + "</div>",
            id: m(node.id),
            node: node,
            events: ["click", "keydown"],
        };
    }

    function renderFieldgroup(node) {
        let innerHTML = "";
        let events = [];
        let result;
        if (node.label) {
            innerHTML += "<h3>" + node.label + "</h3>";
        }

        // The core of the renderer, and the inner loop of
        // the Bowtie Application. For each field provided
        // by the Bowtie Portfolio, the switch statement
        // decides how to render it, collecting the HTML in a
        // string and the events that must be attached after
        // the render into an array.  Once this function is
        // complete, the compiled results are returned to the
        // `renderPortfolio` function, which then replaces the
        // innerHTML of the page target with the newly
        // rendered inputs, and then hooks up all the events
        // as requested.

        function addResult(result) {
            innerHTML += result.text;
            result.events.forEach(function (event) {
                events.push({ event: event, id: result.id, node: result.node });
            });
        }

        node.children.forEach(function (childnode) {
            switch (childnode.kind) {
                case "hidden":
                    break;
                case "select":
                    addResult(renderSelect(childnode));
                    break;
                case "text":
                    addResult(renderText(childnode));
                    break;
                case "check":
                    addResult(renderCheck(childnode));
                    break;
                case "fieldgroup":
                    result = renderFieldgroup(childnode);
                    innerHTML += result.text;
                    events = events.concat(result.events);
                    break;
                case "multigroup":
                    childnode.children.map(renderFieldgroup).forEach(function (result) {
                        innerHTML += result.text;
                        events = events.concat(result.events);
                    });
                    break;
                default:
                    console.log("Unhandled:", childnode);
                    break;
            }
        });
        return {
            text: innerHTML,
            events: events,
        };
    }

    // After each render, we must set up the control.  In order, we set up
    // a submit button, a "highlight errors" button, and an event handler
    // for every object on the form.
    function setupSubmitButton() {
        const token = new URLSearchParams(window.location.search).get("integration") || "";
        document.getElementById("ya-submit-button").addEventListener("click", function () {
            fetch("/portfolio/submit", {
                method: "POST",
                body: JSON.stringify({ data: portfolio.payload }),
                headers: {
                    "Content-Type": "application/json",
                    "x-integration-token": token,
                },
            })
                .then(function (response) {
                    response.json().then(function (result) {
                        console.log(result);
                        if (result.kind === "success") {
                            portfolioId = result.portfolioId;
                        }
                    });
                })
                .catch(function (response) {
                    console.log("Error: ", response);
                });

            setTimeout(function () {
                requestStatus();
            }, 250);
        });
    }

    function requestStatus() {
        if (portfolioId === null) {
            setTimeout(function () {
                requestStatus();
            }, 500);
            return;
        }

        const token = new URLSearchParams(window.location.search).get("integration") || "";
        fetch(`/portfolio/status?id=${portfolioId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-integration-token": token,
            },
        }).then(function (response) {
            if (response.ok) {
                response.json().then(function (result) {
                    validationDetails = {
                        valid: result.isValid,
                        errors: result.validationResult
                            ? result.validationResult.map(function (r) {
                                  return {
                                      field: r.field,
                                      path: r.path,
                                      title: r.title,
                                      details: r.detail,
                                  };
                              })
                            : [],
                    };
                    renderPortfolio();
                });
            } else {
                validationDetails = {
                    valid: false,
                    errors: [
                        {
                            field: null,
                            title: "Unable to retrieve status",
                        },
                    ],
                };
                renderPortfolio();
            }
        });
    }

    // "Highlight errors" is offered at the end, to avoid triggering a
    // random "you got it wrong" message when the user isn't finished
    // with some text input. It interrupts their workflow and it
    // mistakes "incomplete" for "incorrect," which is a terrible user
    // experience.

    function setupHighlightButton() {
        document.getElementById("ya-highlight-validity").addEventListener("click", function (event) {
            event.preventDefault();
            highlightValidity = !highlightValidity;
            renderPortfolio();
        });
    }

    // Every node gets its own handler.  For every event, we transfer
    // the HTML input object's value to the portfolio, and then redraw
    // the portfolio automatically.  This is actually far less
    // intrusive that you'd think, but with a proper, reactive framework,
    // this can be made faster and prettier.

    function makeHandler(node) {
        function update(event, direction) {
            direction = direction ? direction : 0;
            event.preventDefault();
            portfolio.set(node, event.target.value);
            window.sessionStorage.setItem("young_alfred", JSON.stringify(portfolio.application));
            lastTabEvent =
                event.relatedTarget === null || event.relatedTarget === undefined
                    ? { target: event.target.id, direction: direction }
                    : { target: event.relatedTarget.id, direction: 0 };
            renderPortfolio();
        }

        return function (event) {
            // A special handler to assist with tabbing through the application.
            if (event.type === "keydown") {
                if (event.key === "Tab") {
                    update(event, event.shiftKey ? -1 : +1);
                }
                return;
            }
            update(event, 0);
        };
    }

    // What to draw at the end when the portfolio has been validated.
    const submitButton =
        '<div class="fieldset" id="ya-fg-final-submit"><button id="ya-submit-button">' +
        "Submit Application</button></div>";

    // What to draw at the end when the portfolio hasn't been validated.
    function highlightButton() {
        const checked = highlightValidity ? " checked" : "";
        return (
            '<div class="fieldset" id="ya-fg-final-submit">' +
            `<input id="ya-highlight-validity" type="checkbox" ${checked}/>` +
            "<label>Show invalid questions</label></div>"
        );
    }

    function validationResults() {
        if (validationDetails.valid) {
            return '<div class="fieldset"><h3>Your application has successfully been sent!</h3></div>';
        }

        return (
            '<div class="fieldset"><h3>Failure</h3>' +
            validationDetails.errors
                .map(function (error) {
                    `<p><strong>${error.field || "whole application"}</strong>: ${error.title}</p>`;
                })
                .join("\n") +
            "</div>"
        );
    }

    let previousEvents = [];

    // The introductory renderer.  One thing you can be assured of is that
    // the all objects of the `portfolio.view` root are Fieldgroups, and
    /// calling the `renderFieldgroup()` function above is correct.

    function renderPortfolio() {
        let innerHTML = "";
        let events = [];
        tabIndex = 0;

        // This frees the event/input relationship, which saves memory
        // by allowing the JS interpreter to free the associated HTML
        // objects.
        previousEvents.forEach(function (event) {
            const input = document.getElementById(event.id);
            input.removeEventListener(event.event, event.handler);
        });
        previousEvents = [];

        // Construct the new HTML form.  Since the old HTML objects
        // have no listeners anymore, they will now be correctly reaped
        // by the Javascript VM.
        portfolio.view.forEach(function (node) {
            const r = renderFieldgroup(node);
            const invalid = node.valid.valid === false && highlightValidity ? " invalid" : "";
            innerHTML += `<div class="fieldset${invalid}" id="ya-fg-${m(node.id)}">${r.text}</div>`;
            events = events.concat(r.events);
        });

        // If the portfolio is completely valid, we offer a
        // submit button, otherwise we offerthe user the option
        // of highlighting invalid fieldgroups.
        if (portfolioId !== null) {
            if (validationDetails !== null) {
                innerHTML += validationResults();
            }
        } else {
            if (portfolio.valid) {
                innerHTML += submitButton;
            } else {
                innerHTML += highlightButton();
            }
        }

        // Render the new HTML form.
        const main = document.getElementById("main");
        main.innerHTML = innerHTML;

        // For all the objects in the form, hook up the event
        // listeners. Keep a copy of the event listener around so it
        // can be removed and memory recovered.
        events.forEach(function (event) {
            const input = document.getElementById(event.id);
            const handler = makeHandler(event.node);
            input.addEventListener(event.event, handler);
            previousEvents.push({
                id: event.id,
                event: event.event,
                handler: handler,
            });
        });

        if (portfolioId !== null) {
            // no-top
        } else {
            if (portfolio.valid) {
                setupSubmitButton();
            } else {
                setupHighlightButton();
            }
        }

        // This is a bit of magic.  Because the Bowtie API produces a
        // new version of the form with every major interaction, the
        // location of tab events (moving from one field to the next)
        // is broken; the browser's tab order is not preserved
        // between renders. Above, in the event handler, if the event
        // was "Keypress:Tab", we record the DOM Id of the field that
        // generated the event.  Here, if that record is populated,
        // we find the _current_ location of that field, get its Tab
        // ID, find the object with the _next_ Tab ID, and set the
        // focus there.  This works... most of the time.
        //
        // The handler is wrapped in a setTimeout() function to
        // ensure that it runs after the page has been completely
        // rendered and all the event handlers have been hooked
        // up correctly.

        setTimeout(function () {
            if (lastTabEvent !== null) {
                const lastTabTarget = document.getElementById(lastTabEvent.target);
                const direction = lastTabEvent.direction;
                lastTabEvent = null;
                if (lastTabTarget && lastTabTarget.hasAttribute("tabindex")) {
                    const nextTabIndex = parseInt(lastTabTarget.getAttribute("tabindex"), 10) + direction;
                    const nextTabTarget = document.querySelector(
                        `input[tabindex="${nextTabIndex}"], select[tabindex="${nextTabIndex}"]`
                    );
                    if (nextTabTarget) {
                        nextTabTarget.focus();
                    }
                }
            }
        }, 0);
    }

    // Kickstart the Application process.
    renderPortfolio();
})();
