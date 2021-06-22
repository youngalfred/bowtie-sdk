![Language: Javascript](https://img.shields.io/badge/language-Javascript-green.svg)
![JS Framework: Angular 12](https://img.shields.io/npm/v/@angular/core.svg?logo=npm&logoColor=fff&label=NPM+package&color=dd0330)
![Topic: Web Development](https://img.shields.io/badge/topic-Web_Development-green.svg)
![Status: Beta](https://img.shields.io/badge/status-Beta-yellow.svg)

# The Young Alfred Bowtie SDK: A Basic Angular Implementation Demo

This repository contains two items: an Angular app, which implements a 
complete, functional, and interactive UI for the Young Alfred Bowtie SDK, 
and a simple implementation of the forwarding server. *This repository* 
is intended as a starting point and a reference for your developers.

## The implementation

In the `./src` folder, you will find a complete Angular implementation of the
application process.  Because the form is highly dynamic, it is not a
traditional HTML form, but instead a reactive system that maintains keys
and values internally.  With every significant interaction with the
form-- every `click`, `blur`, or `tab`-- the application and the form
are automatically checked, validated, and updated.

The implementation consists of several components that generate the standard
HTML input objects:

- root component that contains, watches, and re-renders as the dynamic portfolio object is updated (`app.component`)
- parent component to all field groups (and individual fields) (`field-group.component`)
- text box (`text-field.component`)
- check box (`checkbox-field.component`)
- select dropdown (`select-field.component`)

And two managerial functions:

- the renderer for nested collections of application questions (`makeFieldGroups`)
- the reducer that adds event handlers to each field object (`propsReducer`)

Plus, `updateField`, which serves as a typical event handler.

## The forwarding server

As a Young Alfred partner, you should have acquired a Young Alfred
API Key. The API Key is *private*, and should not be exposed to the
web. The forwarding server included in this repository serves as a basic
demonstration of how to receive the content from the Bowtie SDK and
forward that content to the Young Alfred Bowtie API with your
API Key.

This instance of the forwarding server also includes a static file
service for the built Angular implementation.

## Running the demonstration

This demonstration can be run on a single developer's machine and
requires no special hardware or access.

After unpacking this archive and running `npm install` to acquire all
dependencies, open a new terminal session and run the following:

``` shellsession
$ export BOWTIE_API_KEY="<Your Bowtie API Key>"
$ npm run server
```

The BOWTIE_API_KEY environment variable is required and has no default.
The running application will be available on your local machine at port
3001: [http://localhost:3001/](http://localhost:3001/).

The server is less than a hundred lines of well-commented Javascript,
written to the [Express app server](https://expressjs.com/) framework.
Other environment variables which can alter the behavior of the server
include:

- `BOWTIE_API_URL`: This defaults to the Bowtie Developer Sandbox.
- `BOWTIE_LOCAL_PORT`: The port on which the application runs
- `BOWTIE_STATIC_CONTENT`: The folder in which the client application
  will be found.
  
### Running the test

The test portion of the demonstration does require you have a recent
version of chrome installed.  The version listed in `package.json` is
Chrome 91; you may have to adjust this and re-run `npm install` to get
the correct driver for your installed version of Chrome.
## LICENSE

This repository constitutes "explanatory related materials for the
Bowtie SDK," and as such is covered under the Bowtie SDK END USER
LICENSE AGREEMENT.  [A copy of that license has been provided.](./LICENSE.md)
