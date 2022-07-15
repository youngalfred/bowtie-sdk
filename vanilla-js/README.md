![Language: Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=Webpack&logoColor=white)
![Topic: Web Development](https://img.shields.io/badge/topic-Web_Development-green.svg)
![Status: Beta](https://img.shields.io/badge/status-Beta-yellow.svg)

# The Young Alfred Bowtie SDK: A Vanilla JS Implementation Demo

This folder contains a single Javascript file (`src/index.js`) implementing a complete, functional, and interactive UI for the Young
Alfred Bowtie SDK.

## The implementation

In the `./src` folder, you will find a complete implementation of the
application process. Because the form is highly dynamic, it is not a
traditional HTML form, but instead a reactive system that maintains keys
and values internally. With every significant interaction with the
form-- every `click`, `blur`, or `tab`-- the application and the form
are automatically checked, validated, and updated.

The implementation consists of three functions that generate standard HTML
input objects:

- text box (`renderText`)
- check box (`renderCheck`)
- select dropdown (`renderSelect`)

And two managerial functions:

- a handler for nested collections of application questions (`renderFieldgroup`)
- a handler for the root of the application (`renderPortfolio`).

Plus the usual utility functions and event handlers. The code is
heavily commented and should be straightforward to understand.

## The forwarding server

As a Young Alfred partner, you should have acquired a Young Alfred
PartnerID. The PartnerID is *private*, and should not be exposed to the
web. The forwarding server included in this repository includes a basic
demonstration of how to receive the content from the Bowtie SDK and
forward that content to the Young Alfred Bowtie API with your
PartnerID, as well as providing several additional services.

This instance of the forwarding server also includes a static file
service for the built implementation.

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

First, run the Vanilla JS demonstration by following the directions above.
Then, follow the instructions described in the [README.md](../README.md#running-the-test) of the project root's directory.

## LICENSE

This repository constitutes "explanatory related materials for the
Bowtie SDK," and as such is covered under the Bowtie SDK END USER
LICENSE AGREEMENT. [A copy of that license has been provided.](./LICENSE.md)
