![JS Framework: Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Language: TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

This Bowtie demo was developed with Vue 3 and Vite.
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
- check box (`checkbox-field.component`)
- select dropdown (`select-field.component`)
- radio button (`radio-field.component`)

And two managerial functions:

- the renderer for nested collections of application questions (`makeFieldGroups`)
- the reducer that adds event handlers to each field object (`propsReducer`)

Plus, `updateField`, which serves as a re-usable event handler.

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

After unpacking this archive and running `npm install` to acquire all
dependencies, open a new terminal session and run the following:

``` shellsession
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





## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
