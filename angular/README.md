![Language: TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JS Framework: Angular 12](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)

# The Young Alfred Bowtie SDK: A Basic Angular Implementation Demo

This repository contains two items:

1. an Angular app, which implements a complete, functional, and interactive UI for the Young Alfred Bowtie SDK.
2. a simple implementation of the forwarding server.

## The implementation

In the `./src` folder, you will find a complete Angular implementation of the
application process. Because the form is highly dynamic, it is not a
traditional HTML form, but instead a reactive system that maintains keys
and values internally. With every significant button click, dropdown selection, and input keystroke,
the application is automatically checked, validated, and updated.

The implementation consists of several components that generate the standard
HTML input objects:

- root component that contains, watches, and re-renders as the dynamic portfolio object is updated (`app.component`)
- parent component to all field groups (and individual fields) (`field-group.component`)
- text box (`text-field.component`)
- file input (`file-field.component`)
- check box (`checkbox-field.component`)
- select dropdown (`select-field.component`)
- radio button (`radio-field.component`)

And two managerial functions:

- the renderer for nested collections of application questions (`makeFieldGroups`)
- the reducer that adds event handlers to each field object (`propsReducer`)

Plus, `updateField`, which serves as a re-usable event handler.

## The forwarding server

As a Young Alfred partner, you should have acquired a Young Alfred
API Key. The API Key is _private_, and should not be exposed to the
web. The forwarding server included in this repository serves as a basic
demonstration of how to receive the content from the Bowtie SDK and
forward that content to the Young Alfred Bowtie API with your
API Key.

This instance of the forwarding server also includes a static file
service for the built Angular implementation.

## Running the demonstration

After unpacking this archive and running `npm install` to acquire all
dependencies, open a new terminal session and run the following:

```shellsession
$ export BOWTIE_API_KEY="<Your Bowtie API Key>"
$ npm run server
```

The BOWTIE_API_KEY environment variable is required and has no default.
The running application will be available on your local machine at port
3001: [http://localhost:3001/](http://localhost:3001/).

### Running the test

First, run the Angular demonstration by following the directions above.
Then, follow the instructions described in the [README.md](../README.md#running-the-test) of the project root's directory.

## LICENSE

This repository constitutes "explanatory related materials for the
Bowtie SDK," and as such is covered under the Bowtie SDK END USER
LICENSE AGREEMENT. [A copy of that license has been provided.](./LICENSE.md)
