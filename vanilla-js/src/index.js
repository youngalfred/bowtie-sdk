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
const { Portfolio } = require("@youngalfred/bowtie-sdk");
const FileField = require("./file-field");
const getSideEffectFor = require("./side-effects");

const prevFields = {}
const bowtieConfig = {
    // We provide defaults values for the below endpoints,
    // but feel free to customize as needed:
    apiUrls: {
      submit: "/portfolio/submit",
      getAutoByVin: "/auto/vin/", // notice the trailing "/"
      getAutoMakesByYear: "/auto/makes",
      getAutoModelsByYearAndMake: "/auto/models",
      getAutoBodyTypesByYearMakeAndModel: "/auto/bodystyles"
    },
    /**
     * The sdk will retry failed requests (for the above api endpoints)
     * three times at most (after the initial failure) when one of the following conditions is met:
     * - an http error code that you specified in the retryErrorCodes section below is received
     * - the request fails to send
     * - no response is received (timeout)
     */
    retryErrorCodes: {
      submit: [500, 503, 504],
      /**
       * By omitting retry codes for the following endpoints,
       * you are signaling not to retry failed requests:
       * 
       * - getAutoByVin: [],
       * - getAutoMakesByYear: [],
       * - getAutoModelsByYearAndMake: [],
       * - getAutoBodyTypesByYearMakeAndModel: [],
       */
    }
}

// Attempt to recover an item from the localStorage (the current
// live browser tab or window _only_; this information will disappear
// when you close the tab or window).

function maybeLocalstore() {
    try {
        const application = window.localStorage.getItem("bowtie_sdk_demo");
        return JSON.parse(application ? application : "{}");
    } catch (e) {
        console.log(e);
        return {};
    }
};

(async function () {
    // The portfolio object this session is managing.

    portfolio = new Portfolio({ ...bowtieConfig, application: maybeLocalstore() });

    // When complete, we should get back a valid portfolio ID.

    portfolioId = null;

    sideEffects = [];

    // After a round-trip through your local service, this will be
    // populated with the results of your submission.

    validationDetails = null;

    // The next two fields are to help keep track of which field the
    // user recently touched.  Normally, a good framework such as
    // React or Vue keeps track of this for us.

    tabIndex = 0;
    lastTabEvent = null;

    // If set to true, adds the 'invalid' class to any fieldgroups that
    // are invalid.

    highlightValidity = false;

    // Bowtie uses a JSON-driven dotted format for its naming scheme.
    // This function turns the dotted fieldnames of the Bowtie input
    // objects into dashed names suitable to HTML and CSS.

    function m(s) {
        return s.replace(/\./g, "-");
    }

    // This is a pure HTML implementation.  Most of our input objects have a
    // fairly standard behavior: an object with an ID generates an event that
    // will then trigger an update.  The event handler has four side-effects:
    // - it updates the portfolio
    // - it saves the portfolio to localStorage
    // - it pushes a "focus on next render" event into the state handler.
    // - it pushes a "render" call onto the execution queue.

    function makeHandler(node, eventValueExtractor = (event) => Promise.resolve(event.target.value)) {
        function update(event, direction) {
            direction = direction ? direction : 0;
            event.preventDefault();
            eventValueExtractor(event).then(value => {
                portfolio.set(node, value);
                window.localStorage.setItem("bowtie_sdk_demo", JSON.stringify(portfolio.application));

                // Because the portfolio tree of questions may change on
                // every update, requiring a re-render, the focus of the
                // application must be managed manually.  Here, we store
                // the information of the event to determine what object
                // should be focused on next.  Because we could be adding
                // new inputs, we only keep the ID of the current object
                // and the direction of focus change, if any.
                //
                // If there is a relatedTarget, the user deliberately
                // interacted with that target, and the focus must be
                // moved there.
    
                lastTabEvent =
                    event.relatedTarget === null || event.relatedTarget === undefined
                        ? { target: event.target.id, direction: direction }
                        : { target: event.relatedTarget.id, direction: 0 };
                setTimeout(renderPortfolio, 0);
            }).catch(_err => {
                // Expections are thrown to intentionally avoid
                // re-draws (aka to avoid calling renderPortfolio())
            })
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

    // Returns an HTML label if label text is present; an empty string
    // otherwise.

    function maybeLabel(node) {
        return node.label ? '<label class="label">' + node.label + ": </label>" : "";
    }

    // The renderers for our application.  Each renderer is
    // responsible for generating two things: An HTML respresentation
    // of the field, and a detached event handler,along with the
    // metadata needed to make the event handler behave correctly.  We
    // create *detached* event handlers in this phase because we're
    // going to re-draw the entire form first, and then attach the
    // event handlers afterward.  Note that the ID being passed here
    // is the HTML ID Attribute of the object that _will be_ attached
    // to the DOM during the draw phase of the render task.

    function mapObjectEventToHandler(event, id, node, eventValueExtractor) {
        return {
            event: event,
            id: id,
            handler: makeHandler(node, eventValueExtractor),
        };
    }

    // Render an <input type="text" ... /> field for free-form input.
    // What's important to note here is that the value of an input
    // object is always stored in, and retrieved from, the portfolio.
    // The value of the input object is only relevant to the HTML
    // in order to display it to the customer.

    function renderText(node) {
        const mid = m(node.id);
        tabIndex++;
        const input = `<input id="${mid}" name="${mid}" value="${node.value}" data-automation-id="${mid}" tabindex="${tabIndex}"/>`;
        return {
            text: '<div class="question">' + maybeLabel(node) + input + "</div>",
            events: ["blur", "keydown"].map(function (event) {
                return mapObjectEventToHandler(event, mid, node);
            }),
        };
    }

    function renderCheckbox(node) {
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
        const input = `<input type="checkbox" id="${mid}" name="${mid}" ${checked} data-automation-id="${mid}" tabindex="${tabIndex}" />`;

        return {
            text: '<div class="question">' + maybeLabel(node) + input + "</div>",
            events: ["click", "keydown"].map(function (event) {
                return mapObjectEventToHandler(event, mid, node);
            }),
        };
    }

    // Render an <input type="file" multiple ... /> field to accept multiple file upload inputs.
    // What's important to note here is that the value of a file field MUST be
    // parsed and stringified (similar to the multi-select dropdowns) when rendering and setting a new value.
    // You will call the bowtie-api's /v1/file endpoint with the binary file data and set the file field's value
    // by adopting the following pattern: '{"file1 name":"objectId returned from the api", "file2 name":"objectId returned from the api"}`.
    // This pattern will also make it easy to display which files have uploaded successfully to your customers.
    function renderFile(node) {
        const mid = m(node.id);
        let fileField = new FileField();
        const uploadId = `${mid}-upload-files`;
        const selectFilesId = `${mid}-select-files`;
        const parsedValue = JSON.parse(node.value);
        const uploadedFiles = `<br>Successfully uploaded files<br>${Object.keys(parsedValue).map(fileName => `<span>${fileName}</span>`).join("<br>")}`;

        return [
            {
                text: '<div class="question">' + maybeLabel(node) + uploadedFiles + "</div>",
                events: []
            },
            {
                text: `<button id="${selectFilesId}" tabindex="${++tabIndex}" data-automation-id="${selectFilesId}">Select files</button>`,
                events: ["click"].map(function (event) {
                    return mapObjectEventToHandler(event, selectFilesId, node, function() {
                        fileField.makeNewFileInput();
                        // Reject to prevent a re-draw, which would
                        // cause fileField to lose track of all selected files
                        return Promise.reject("");
                    });
                }),
            },
            {
                text: `<button id="${uploadId}" tabindex="${++tabIndex}" data-automation-id="${uploadId}">Upload files</button>`,
                events: ["click"].map(function (event) {
                    return mapObjectEventToHandler(event, uploadId, node, function () {
                        return new Promise((resolve, _reject) => {
                            fileField.uploadFiles().then(successfullyUploadedFiles => {
                                resolve(JSON.stringify({...parsedValue, ...successfullyUploadedFiles}));
                            });
                        });
                    });
                }),
            },
        ];
    }

    // Render a <select> input object for enumerated fields.
    function renderSelect(node) {
        const mid = m(node.id);
        tabIndex++;

        // The list of enumerated options may need to be modified if
        // the user has not yet interacted with the input object. In
        // that case, we make a shallow copy of the options list (to
        // avoid mutating the original list) and, if necessary, splice
        // in the blank value at the top.
        //
        // This may seem unnecessary, since the option list for any
        // given object is re-built with every iteration, but that's
        // an internal implementation detail that you or I, as
        // consumers of the API, should not rely upon.

        let options = node.options;
        if (node.value === "") {
            options = node.options.map(function (a) {
                return a;
            });
            options.splice(0, 0, { name: "", label: "" });
        }

        const isMultiSelect = node.classes.includes("multi-select-dropdown");
        const parsedMultiValue = isMultiSelect ? JSON.parse(node.value) : {};

        // Draw (as strings) all the '<option>' objects, and join them
        // together into one long string, then assemble the input
        // object together.

        const renderedOptions = options
            .map(function (opt) {
                const selected = node.value !== "" && node.value == opt.name;
                return `<option value="${opt.name}"${selected ? " selected" : ""}>${opt.label}</option>`;
            })
            .join("\n");
        const input = `<select id="${mid}" name="${mid}" tabindex="${tabIndex}" data-automation-id="${mid}">${renderedOptions}</select>`;

        return [{
            text: '<div class="question">' + maybeLabel(node) + input + "</div>",
            events: ["change", "keydown"].map(function (event) {
                return mapObjectEventToHandler(event, mid, node, isMultiSelect ? function (event) {

                    const { value = "", options } = event.target;
                    const label = Array.from(options).find((o) => o.selected)?.label;

                    if (!label) {
                        throw new Error("Developer error. Unable to find label of selected option.");
                    }

                    Promise.resolve(JSON.stringify({...parsedMultiValue, [label]: value }));
                } : undefined);
            }),
        },
        ...Object.entries(parsedMultiValue).map(([selectedLabel, selectedValue]) => {
            const id = `${mid}.${selectedValue}.remove`;
            return {
                text: `<div id="${id}" data-automation-id="${id}" class="tag">
                            <span>${selectedLabel}</span>
                            <span class="remove-btn">x</span>
                        </div>`,
                events: ["click"].map(event => ({
                    event,
                    id,
                    handler: function () {
                        const { [selectedLabel]: removed, ...newValue } = parsedMultiValue;
                        portfolio.set(node, JSON.stringify(newValue));
                        window.localStorage.setItem("bowtie_sdk_demo", JSON.stringify(portfolio.application));
                        setTimeout(renderPortfolio, 0);
                    },
                }))
            };
        })];
    }

    // This is an example of a custom fieldgroup: Types of Houses.

    // A look at the source code will show you that house-type is a
    // root fieldgroup, and that it has only one field, the list of
    // house types. We can exploit that knowledge to create a custom
    // fieldgroup display, and provide images associated with each
    // house type.
    //
    // Choosing to use radio buttons for this sort of display is
    // logical, but radio buttons have a different event mechanism
    // from other input objects.  Both <select> and <radio> have the
    // same purpose: to pick one object from a list.  But <select> has
    // a single ID for an entire set of selections, and radios have
    // one-ID-per-selection scheme.  We must compensate for that by
    // creating a uniqueID per option, rather than for the whole
    // field, and then mapping an event on a single option back to
    // node associated with the whole field.

    function renderRadioFieldGroup(node) {
        let innerHTML = "<h3>" + node.label + "</h3>";
        const field = node.children[0];
        const mid = m(field.id);

        function makeRadio(option, optionIdx) {
            tabIndex++;
            const checked = option.name === field.value ? "checked " : " ";
            const radioId = `${mid}-${optionIdx + 1}`;
            const html = `
<div class="${m(node.id)}">
  <img src="./images/${option.name}.jpg" />
  <div> 
    <input type="radio" 
           id="${radioId}"
           class="${mid}" 
           name="${mid}" 
           value="${option.name}"
           tabindex="${tabIndex}" 
           data-automation-id="${radioId}"
           ${checked}
    />
    <label for="${option.name}">${option.label}</label>
  </div>
</div>`;
            return [html, radioId];
        }

        const radios = field.options.map(makeRadio);
        const radioHTML = radios.map(function (r) {
            return r[0];
        });

        const radioEvents = radios.reduce(function (accum, radio) {
            accum.push(mapObjectEventToHandler("click", radio[1], field));
            accum.push(mapObjectEventToHandler("keydown", radio[1], field));
            return accum;
        }, []);

        return {
            text: innerHTML + radioHTML.join("\n"),
            events: radioEvents,
        };
    }

    function renderFieldgroup(node) {
        let innerHTML = "";
        let events = [];
        let result;
        if (node.label) {
            innerHTML += "<h3>" + node.label + "</h3>";
        }

        // The core of the renderer, and the inner loop of the Bowtie
        // Application. For each child of a fieldgroup provided by the
        // Bowtie Portfolio, the switch statement decides how to
        // render it, collecting:
        //
        // - the HTML into a string,
        // - the events that must be attached into an array.
        //
        // Once this function is complete, the compiled results are
        // returned to the `renderPortfolio` function, which then
        // replaces the innerHTML of the page target with the newly
        // rendered inputs, and then hooks up all the events as
        // requested.

        function addResult(result) {
            innerHTML += result.text;
            events = events.concat(result.events);
        }

        node.children.forEach(function (childnode) {
            const sideEffect = getSideEffectFor(portfolio, childnode);
            // Currently, only select & text fields have side effects
            if (sideEffect && prevFields[childnode.id]?.value !== childnode.value) {
                sideEffects.push(sideEffect)
                prevFields[childnode.id] = childnode;
            }

            switch (childnode.kind) {
                case "hidden":
                    break;
                case "file":
                    renderFile(childnode)
                        .forEach(element => addResult(element));
                    break;
                case "select":
                    renderSelect(childnode)
                        .forEach(element => addResult(element));
                    break;
                case "text":
                    addResult(renderText(childnode));
                    break;
                case "check":
                    addResult(renderCheckbox(childnode));
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
        document.getElementById("ya-submit-button").addEventListener("click", function () {
            fetch("/portfolio/submit", {
                method: "POST",
                body: JSON.stringify({ data: portfolio.payload }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(function (response) {
                    response.json().then(async function (result) {
                        portfolioId = result.portfolioId;
                        validationDetails = {
                            valid: result.kind === "success",
                            errors: result.errors
                                ? result.errors.map(function (r) {
                                    return {
                                        field: r.field,
                                        path: r.path,
                                        title: r.title,
                                        details: r.detail,
                                    };
                                })
                                : [],
                        };
                        console.log(validationDetails);
                        await renderPortfolio();
                    });
                })
                .catch(function (response) {
                    console.log("Error: ", response);
                });
        });
    }

    // "Highlight errors" is offered at the end, to avoid triggering a
    // random "you got it wrong" message when the user isn't finished
    // with some text input. Doing so mistakes "incomplete" for
    // "incorrect," which can interrupt and annoy the user, causing a
    // terrible user experience.

    function setupHighlightButton() {
        document.getElementById("ya-highlight-validity").addEventListener("click", function (event) {
            event.preventDefault();
            highlightValidity = !highlightValidity;
            renderPortfolio();
        });
    }

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

    // What to draw after the form has been submitted and the
    // validation results have been retrieved.

    function validationResults() {
        if (validationDetails.valid) {
            return '<div class="fieldset" id="success-message"><h3>Your application has successfully been sent!</h3></div>';
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

    // The root renderer.  One thing you can be assured of is thatthe
    // all objects of the `portfolio.view` root are Fieldgroups, and
    // calling the `renderFieldgroup()` function above is correct.

    async function renderPortfolio() {
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
        // have no listeners anymore, they will now be correctly
        // reaped by the Javascript VM.

        portfolio.view.forEach(function (node) {
            const renderer = ["house-type", "construction-type"].includes(node.id) ? renderRadioFieldGroup : renderFieldgroup;
            const r = renderer(node);
            const invalid = node.valid.valid === false && highlightValidity ? " invalid" : "";
            innerHTML += `<div class="fieldset${invalid}" id="ya-fg-${m(node.id)}">${r.text}</div>`;
            events = events.concat(r.events);
        });

        // If the portfolio is completely valid, we offer a submit
        // button, otherwise we offerthe user the option of
        // highlighting invalid fieldgroups.

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

        // Phase 1: Replace the current HTML DIV of our application
        // with the newly rendered instance.

        const main = document.getElementById("main");
        main.innerHTML = innerHTML;

        // Phase 2: For all the objects in the form, hook up the event
        // listeners. Then transfer the events into previousEvents, so
        // the associated listeners can be removed and memory
        // recovered on the next render.

        events.forEach(function (event) {
            const input = document.getElementById(event.id);
            input.addEventListener(event.event, event.handler);
        });
        previousEvents = events;

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

            (async function applySideEffects() {
                let shouldRerender = false

                for (let i = 0; i < sideEffects.length; i++) {
                    if (await sideEffects[i]()) {
                        shouldRerender = true
                    }
                }
    
                sideEffects = []
                if (shouldRerender) {
                    await renderPortfolio();
                }
            })()
        }, 0);
    }

    // Kickstart the Application process.
    await renderPortfolio();
})();
