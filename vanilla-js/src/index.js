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
import {
  Portfolio,
  BowtieHomePropertyDataService,
  BowtieAutoIdentityDataService,
  BowtieAutoMakesDataService,
  BowtieAutoModelsDataService,
  BowtieAutoBodyTypesDataService,
  // authenticateSession,
  getPartialPortfolio,
  startBowtieSession,
} from '@youngalfred/bowtie-sdk'
const { getCookies, SESSION_ID } = require('./cookie')
const FileField = require('./file-field')
const modifyNode = require('./modifiers.js')

// Attempt to recover an item from the localStorage (the current
// live browser tab or window _only_; this information will disappear
// when you close the tab or window).

function maybeLocalstore() {
  try {
    const application = window.localStorage.getItem('bowtie_sdk_demo')
    return JSON.parse(application ? application : '{}')
  } catch (e) {
    console.log(e)
    return {}
  }
}

function updateSessionId(id) {
  // Remember the Bowtie Session Id to resume it later
  document.cookie = `${SESSION_ID}=${id}`
}

;(function () {
  // The portfolio object this session is managing.

  let portfolio = new Portfolio()

  // When complete, we should get back a valid portfolio ID.

  let portfolioId = null

  // After a round-trip through your local service, this will be
  // populated with the results of your submission.

  let validationDetails = null

  // The next two fields are to help keep track of which field the
  // user recently touched.  Normally, a good framework such as
  // React or Vue keeps track of this for us.

  let tabIndex = 0
  let lastTabEvent = null

  // If set to true, adds the 'invalid' class to any fieldgroups that
  // are invalid.

  let highlightValidity = false

  // These are special renderers or overrides.
  // Notice that the fieldgroup with id 'wind-mitigation-fl' renders with a .png
  // instead of the normal tree of select, check, and text inputs.

  let renderers = {
    'wind-mitigation-fl': renderFLWindMitFieldGroup,
  }

  // This is a pure HTML implementation.  Most of our input objects have a
  // fairly standard behavior: an object with an ID generates an event that
  // will then trigger an update.  The event handler has four side-effects:
  // - it updates the portfolio
  // - it saves the portfolio to localStorage
  // - it pushes a "focus on next render" event into the state handler.
  // - it pushes a "render" call onto the execution queue.

  // Returns an HTML label if label text is present; an empty string
  // otherwise.

  function maybeLabel(node) {
    return node.label ? '<label class="label">' + node.label + ': </label>' : ''
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

  function handleChange(
    node,
    eventValueExtractor = node.onChange || (event => Promise.resolve(event.target.value)),
  ) {
    function update(event, direction) {
      direction = direction ? direction : 0
      event.preventDefault()
      eventValueExtractor(event)
        .then(value => {
          portfolio.set(portfolio.find(node.id), value)
          window.localStorage.setItem('bowtie_sdk_demo', JSON.stringify(portfolio.application))

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
              : { target: event.relatedTarget.id, direction: 0 }
          setTimeout(renderPortfolio, 0)
        })
        .catch(_err => {
          // Expections are thrown to intentionally avoid
          // re-draws (aka to avoid calling renderPortfolio())
        })
    }

    return function (event) {
      // A special handler to assist with tabbing through the application.

      if (event.type === 'keydown') {
        if (event.key === 'Tab') {
          update(event, event.shiftKey ? -1 : +1)
        }
        return
      }
      update(event, 0)
    }
  }

  function mapObjectEventToHandler(event, id, handler) {
    return {
      event: event,
      id: id,
      handler,
    }
  }

  // Render an <input type="text" ... /> field for free-form input.
  // What's important to note here is that the value of an input
  // object is always stored in, and retrieved from, the portfolio.
  // The value of the input object is only relevant to the HTML
  // in order to display it to the customer.

  function renderText(node) {
    const mid = node.mid
    tabIndex++
    const input = `<input id="${mid}" name="${mid}" value="${node.value}" data-automation-id="${mid}" type="text" tabindex="${tabIndex}"/>`
    return {
      innerHTML:
        `<div id="${mid}-container" class="question">` + maybeLabel(node) + input + '</div>',
      events: ['blur', 'keydown'].map(function (event) {
        return mapObjectEventToHandler(event, mid, handleChange(node))
      }),
    }
  }

  function renderCheckbox(node) {
    const mid = node.mid
    tabIndex++

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

    const checked = node.value === '1' ? 'value="" checked' : 'value="1"'
    const input = `<input id="${mid}" type="checkbox" name="${mid}" ${checked} data-automation-id="${mid}" tabindex="${tabIndex}" />`

    return {
      innerHTML:
        `<div id="${mid}-container" class="question">` + maybeLabel(node) + input + '</div>',
      events: ['click', 'keydown'].map(function (event) {
        return mapObjectEventToHandler(event, mid, handleChange(node))
      }),
    }
  }

  // Render an <input type="file" multiple ... /> field to accept multiple file upload inputs.
  // What's important to note here is that the value of a file field MUST be
  // parsed and stringified (similar to the multi-select dropdowns) when rendering and setting a new value.
  // You will call the bowtie-api's /v1/file endpoint with the binary file data and set the file field's value
  // by adopting the following pattern: '{"file1 name":"objectId returned from the api", "file2 name":"objectId returned from the api"}`.
  // This pattern will also make it easy to display which files have uploaded successfully to your customers.
  function renderFile(node) {
    const mid = node.mid
    let fileField = new FileField()
    const uploadId = `${mid}-upload-files`
    const selectFilesId = `${mid}-select-files`
    const parsedValue = JSON.parse(node.value)
    const uploadedFilesHTML = `<br>Successfully uploaded files<br>${Object.keys(parsedValue)
      .map(fileName => `<span>${fileName}</span>`)
      .join('<br>')}`

    return [
      {
        innerHTML:
          `<div id="${mid}-container" class="question">` +
          maybeLabel(node) +
          uploadedFilesHTML +
          '</div>',
        events: [],
      },
      {
        innerHTML: `<button id="${selectFilesId}" tabindex="${++tabIndex}" data-automation-id="${selectFilesId}">Select files</button>`,
        events: ['click'].map(function (event) {
          return mapObjectEventToHandler(
            event,
            selectFilesId,
            handleChange(node, function () {
              fileField.makeNewFileInput()
              // Reject to prevent a re-draw, which would
              // cause fileField to lose track of all selected files
              return Promise.reject('')
            }),
          )
        }),
      },
      {
        innerHTML: `<button id="${uploadId}" tabindex="${++tabIndex}" data-automation-id="${uploadId}">Upload files</button>`,
        events: ['click'].map(function (event) {
          return mapObjectEventToHandler(
            event,
            uploadId,
            handleChange(node, function () {
              return new Promise((resolve, _reject) => {
                fileField.uploadFiles().then(successfullyUploadedFiles => {
                  resolve(JSON.stringify({ ...parsedValue, ...successfullyUploadedFiles }))
                })
              })
            }),
          )
        }),
      },
    ]
  }

  // Render a <select> input object for enumerated fields.
  function renderSelect(node) {
    const mid = node.mid
    tabIndex++

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

    const isMultiSelect = node.classes.includes('multi-select-dropdown')

    let options = node.options
    if (node.value === '' || isMultiSelect) {
      options = [{ name: '', label: '' }].concat(node.options)
    }

    const parsedMultiValue = isMultiSelect ? JSON.parse(node.value) : {}

    // Draw (as strings) all the '<option>' objects, and join them
    // together into one long string, then assemble the input
    // object together.

    const renderedOptions = options
      .map(function (opt) {
        const selected = node.value !== '' && node.value == opt.name
        return `<option value="${opt.name}"${selected ? ' selected' : ''}>${opt.label}</option>`
      })
      .join('\n')
    const input = `<select id="${mid}" name="${mid}" tabindex="${tabIndex}" data-automation-id="${mid}">${renderedOptions}</select>`

    return [
      {
        innerHTML:
          `<div id="${mid}-container" class="question">` + maybeLabel(node) + input + '</div>',
        events: ['change', 'keydown'].map(function (event) {
          return mapObjectEventToHandler(
            event,
            mid,
            handleChange(
              node,
              isMultiSelect
                ? function (event) {
                    return new Promise((resolve, _reject) => {
                      const { value = '', options } = event.target
                      const label = Array.from(options).find(o => o.selected)?.label

                      if (!label) {
                        throw new Error('Developer error. Unable to find label of selected option.')
                      }

                      resolve(JSON.stringify({ ...parsedMultiValue, [label]: value }))
                    })
                  }
                : undefined,
            ),
          )
        }),
      },
      ...Object.entries(parsedMultiValue).map(([selectedLabel, selectedValue]) => {
        const id = `${mid}.${selectedValue}.remove`
        return {
          innerHTML: `<div id="${id}" data-automation-id="${id}" class="tag">
                            <span>${selectedLabel}</span>
                            <span class="remove-btn">x</span>
                        </div>`,
          events: ['click'].map(event => ({
            event,
            id,
            handler: function () {
              const { [selectedLabel]: removed, ...newValue } = parsedMultiValue
              portfolio.set(node, JSON.stringify(newValue))
              window.localStorage.setItem('bowtie_sdk_demo', JSON.stringify(portfolio.application))
              setTimeout(renderPortfolio, 0)
            },
          })),
        }
      }),
    ]
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

  function renderFLWindMitFieldGroup(node, depth) {
    const { innerHTML: windMitHTML, events } = node.children.reduce(...childRenderReducer(depth))
    const innerHTML = `
            <div class="fieldset" id="ya-fg-${node.mid}">
                <h3>${node.label}</h3>
                <div class="windmit">
                    <img class="windmitForm" src="./images/windmit-form.png" alt="Florida Wind Mitigation Inspection Form" />
                    <div class="windmitPage">
                        ${windMitHTML}
                    </div>
                </div>
            </div>
        `

    return {
      innerHTML,
      events,
    }
  }

  function renderRadio(node) {
    const mid = node.mid
    tabIndex++
    const {
      option: { name, label },
      value,
    } = node
    const checked = name === value ? 'checked ' : ' '

    const innerHTML = `
            <div class="${mid}">
                <img src="./images/${name}.jpg" />
                <div>
                    <input type="radio"
                        id="${mid}"
                        class="${mid}"
                        name="${mid}"
                        value="${name}"
                        tabindex="${tabIndex}"
                        data-automation-id="${mid}"
                        ${checked}
                    />
                    <label for="${name}">${label}</label>
                </div>
            </div>`

    return {
      innerHTML,
      events: ['click', 'keydown'].map(function (event) {
        return mapObjectEventToHandler(event, mid, handleChange(node))
      }),
    }
  }

  function combineResults(resultA, resultB) {
    return {
      innerHTML: resultA.innerHTML + resultB.innerHTML,
      events: resultA.events.concat(resultB.events),
    }
  }

  function childRenderReducer(depth, innerHTML = '') {
    return [(acc, node) => combineResults(acc, render(node, depth)), { events: [], innerHTML }]
  }

  function renderFieldgroup(node, depth) {
    let innerHTML = ''

    if (node.label) {
      innerHTML += '<h3>' + node.label + '</h3>'
    }

    return node.children.reduce(...childRenderReducer(depth, innerHTML))
  }

  function render(rawNode, depth = 0) {
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

    const node = modifyNode(rawNode)
    const newDepth = depth + 1

    const customRenderer = renderers[node.id]
    if (customRenderer) {
      return customRenderer(node, newDepth)
    }

    switch (node.kind) {
      case 'hidden':
        return { events: [], innerHTML: '' }
      case 'file':
        return renderFile(node, newDepth).reduce(combineResults)
      case 'select':
        return renderSelect(node, newDepth).reduce(combineResults)
      case 'text':
        return renderText(node, newDepth)
      case 'radio':
        // Note: the sdk does not have fields of kind radio by default;
        // radio fields are a result of the toRadioGroup modifier located at:
        //  vanilla-js/src/modifiers/groups.js.
        return renderRadio(node, newDepth)
      case 'check':
        return renderCheckbox(node, newDepth)
      case 'fieldgroup':
        let { innerHTML, events } = renderFieldgroup(node, newDepth)

        // This is a top-level field group in the portfolio.view object
        if (depth === 0) {
          const invalid = node.valid.valid === false && highlightValidity ? ' invalid' : ''
          innerHTML = `<div class="fieldset${invalid}" id="ya-fg-${node.mid}">${innerHTML}</div>`
        }

        return {
          events,
          innerHTML,
        }
      case 'multigroup':
        return node.children.reduce(...childRenderReducer(newDepth))
      default:
        throw new Error(`Unhandled node: ${node.kind}`)
    }
  }

  // After each render, we must set up the control.  In order, we set up
  // a submit button, a "highlight errors" button, and an event handler
  // for every object on the form.

  function setupSubmitButton() {
    document.getElementById('ya-submit-button').addEventListener('click', function () {
      portfolio
        .submit({ url: '/portfolio' })
        .then(function (response) {
          response.json().then(function (result) {
            portfolioId = result.portfolioId
            validationDetails = {
              valid: result.kind === 'success',
              errors: result.errors
                ? result.errors.map(function (r) {
                    return {
                      field: r.field,
                      path: r.path,
                      title: r.title,
                      details: r.detail,
                    }
                  })
                : [],
            }
            console.log(validationDetails)
            renderPortfolio()
          })
        })
        .catch(function (response) {
          console.log('Error: ', response)
        })
    })
  }

  // "Highlight errors" is offered at the end, to avoid triggering a
  // random "you got it wrong" message when the user isn't finished
  // with some text input. Doing so mistakes "incomplete" for
  // "incorrect," which can interrupt and annoy the user, causing a
  // terrible user experience.

  function setupHighlightButton() {
    document.getElementById('ya-highlight-validity').addEventListener('click', function (event) {
      event.preventDefault()
      highlightValidity = !highlightValidity
      renderPortfolio()
    })
  }

  const submitButton =
    '<div class="fieldset" id="ya-fg-final-submit"><button id="ya-submit-button">' +
    'Submit Application</button></div>'

  // What to draw at the end when the portfolio hasn't been validated.

  function highlightButton() {
    const checked = highlightValidity ? ' checked' : ''
    return (
      '<div class="fieldset" id="ya-fg-final-submit">' +
      `<input id="ya-highlight-validity" type="checkbox" ${checked}/>` +
      '<label>Show invalid questions</label></div>'
    )
  }

  // What to draw after the form has been submitted and the
  // validation results have been retrieved.

  function validationResults() {
    if (validationDetails.valid) {
      return '<div class="fieldset" id="success-message"><h3>Your application has successfully been sent!</h3></div>'
    }

    return (
      '<div class="fieldset"><h3>Failure</h3>' +
      validationDetails.errors
        .map(function (error) {
          ;`<p><strong>${error.field || 'whole application'}</strong>: ${error.title}</p>`
        })
        .join('\n') +
      '</div>'
    )
  }

  let previousEvents = []

  // The root renderer.  One thing you can be assured of is that
  // all objects of the `portfolio.view` root are Fieldgroups.

  function renderPortfolio() {
    tabIndex = 0

    // This frees the event/input relationship, which saves memory
    // by allowing the JS interpreter to free the associated HTML
    // objects.

    previousEvents.forEach(function (event) {
      const input = document.getElementById(event.id)
      input.removeEventListener(event.event, event.handler)
    })
    previousEvents = []

    // Construct the new HTML form.  Since the old HTML objects
    // have no listeners anymore, they will now be correctly
    // reaped by the Javascript VM.

    let { innerHTML, events } = portfolio.view.reduce(...childRenderReducer(0))

    // If the portfolio is completely valid, we offer a submit
    // button, otherwise we offerthe user the option of
    // highlighting invalid fieldgroups.

    if (portfolioId !== null) {
      if (validationDetails !== null) {
        innerHTML += validationResults()
      }
    } else {
      if (portfolio.valid) {
        innerHTML += submitButton
      } else {
        innerHTML += highlightButton()
      }
    }

    // Phase 1: Replace the current HTML DIV of our application
    // with the newly rendered instance.

    const main = document.getElementById('main')
    main.innerHTML = innerHTML

    // Phase 2: For all the objects in the form, hook up the event
    // listeners. Then transfer the events into previousEvents, so
    // the associated listeners can be removed and memory
    // recovered on the next render.

    events.forEach(function (event) {
      const input = document.getElementById(event.id)
      input.addEventListener(event.event, event.handler)
    })
    previousEvents = events

    if (portfolioId !== null) {
      // no-top
    } else {
      if (portfolio.valid) {
        setupSubmitButton()
      } else {
        setupHighlightButton()
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
        const lastTabTarget = document.getElementById(lastTabEvent.target)
        const direction = lastTabEvent.direction
        lastTabEvent = null
        if (lastTabTarget && lastTabTarget.hasAttribute('tabindex')) {
          const nextTabIndex = parseInt(lastTabTarget.getAttribute('tabindex'), 10) + direction
          const nextTabTarget = document.querySelector(
            `input[tabindex="${nextTabIndex}"], select[tabindex="${nextTabIndex}"]`,
          )
          if (nextTabTarget) {
            nextTabTarget.focus()
          }
        }
      }
    }, 0)
  }

  function onPortfolioUpdated(_error, portfolio) {
    // The portfolio needs to be overwritten even if an error occurs
    // (such as when select fields become text fields due
    // to a data service erroring out).
    portfolio = portfolio
    renderPortfolio()
  }

  function bowtieConfig(sessionId) {
    return {
      onPortfolioUpdated,
      dataFillServices: {
        autoIdentityDataService: new BowtieAutoIdentityDataService({
          url: `/auto/vin/`,
        }),
        autoMakesDataService: new BowtieAutoMakesDataService({
          url: `/auto/makes`,
        }),
        autoModelsDataService: new BowtieAutoModelsDataService({
          url: `/auto/models`,
        }),
        autoBodyTypesDataService: new BowtieAutoBodyTypesDataService({
          url: `/auto/bodystyles`,
        }),
        homePropertyDataService: new BowtieHomePropertyDataService({
          url: `/property`,
        }),
      },
      partialUpdateOptions: {
        // configure the sdk send partial portfolio updates
        // as the customer completes the form. That way no
        // custoemr progress is lost if/when they resume the app later.
        sendPartialUpdates: true,
        url: `/session/${sessionId ?? ''}/progress`,
        handleError: (error) => {
          if (error?.statusCode === 401) {
            // Reload to force user to re-authenticate
            window.location.reload()
          }
        },
      },
    }
  }

  async function manageSession() {
    let sessionId = getCookies()[SESSION_ID] ?? ''

    if (!sessionId) {
      // Create new session
      const { sessionId: newSessionId } = await startBowtieSession({ url: `/session` })

      updateSessionId(newSessionId)
      portfolio = new Portfolio({
        ...bowtieConfig(newSessionId),
        application: maybeLocalstore(),
      })
      renderPortfolio()

      // return early as no partial app exists in the backend yet
      // (the session was just now created)
      return
    }

    try {
      // Resume the partial portfolio associated with the session
      const { data: application } = await getPartialPortfolio({ url: `/session/${sessionId}/progress`})
  
      portfolio = new Portfolio({
        ...bowtieConfig(sessionId),
        application,
      })
      renderPortfolio()
    } catch (error) {
      // The Vanilla JS demo does not show an
      // authentication screen like the Vue and Angular demos.
      // Instead, it offers light instructions below for how you
      // can authenticate the session again by calling the authenticateSession() method.
      updateSessionId('')
      window.location.reload()

      if (error?.statusCode === 401) {
        // 1. Require the customer to complete a custom form
        //    with email and birthdate fields
        // 2. Call authenticateSession({ url: `/session/${sessionId}/authenticate` }).
        //    Also keep in mind the following, when handling the response:
        //    const { authenticated, attemtpsRemaining, lockedOut, ...rest } = await authenticateSession(...)
        // 3. See the Vue or Angular demo for more details on how to handle the response object.
      }
    }
  }

  // Kickstart the Application process.
  renderPortfolio()
  manageSession()
})()
