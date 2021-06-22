![Language: Javascript](https://img.shields.io/badge/language-Javascript-green.svg)
![Topic: Web Development](https://img.shields.io/badge/topic-Web_Development-green.svg)
![Status: Beta](https://img.shields.io/badge/status-Beta-yellow.svg)

# The Young Alfred Bowtie SDK: A Basic Implementation Demo

This repository contains two items: a single Javascript file
implementing a complete, functional, and interactive UI for the Young
Alfred Bowtie SDK, and a simple implementation of the forwarding server.

The Bowtie SDK provides all the knowledge, validation, and organization
necessary to guide a customer through the sometimes bewildering process
of applying for insurance.  Insurance forms are complex, and customers
often struggle to understand whether any given section of an insurance
form is applicable to their situation.  The Bowtie SDK is intended to
guide a customer through the process, using guidance questions to
restrict the form to only those questions necessary for their particular
circumstances.

The purpose of the Bowtie library is to grant you, as a Young Alfred
partner, the ability to build the Bowtie process into your existing web
application processes.  Together, we can enhance the services you
provide and create a complete, secure, and even fun experience out of
the task of insuring the products you provide to your customers.

*This repository* contains the most basic implementation of that
process, written in pure Javascript without reference to frameworks or
libraries.  It is intended as a starting point and a reference for your
developers.

## The implementation

In the `./src` folder, you will find a complete implementation of the
application process.  Because the form is highly dynamic, it is not a
traditional HTML form, but instead a reactive system that maintains keys
and values internally.  With every significant interaction with the
form-- every `click`, `blur`, or `tab`-- the application and the form
are automatically checked, validated, and updated.

The implementation consists of three function generating standard HTML
input objects:

- text box (`renderText`)
- check box (`renderCheck`)
- select dropdown (`renderSelect`)

And two managerial functions:

- a handler for nested collections of application questions (`renderFieldgroup`)
- a handler for the root of the application (`renderPortfolio`).

Plus the usual utility functions and event handlers.  The code is
heavily commented and should be straightforward to understand.

## The forwarding server

As a Young Alfred partner, you should have acquired a Young Alfred
PartnerID.  The PartnerID is *private*, and should not be exposed to the
web.  The forwarding server included in this repository includes a basic
demonstration of how to receive the content from the Bowtie SDK and
forward that content to the Young Alfred Bowtie API with your
PartnerID, as well as providing several additional services.

This instance of the forwarding server also includes a static file
service for the built implementation.

## Running the demonstration

This demonstration can be run on a single developer's machine and
requires no special hardware or access.

After unpacking this archive and running `npm install` to acquire all
dependencies, open a new terminal session and run the following:

``` shellsession
$ export BOWTIE_PARTNER_ID="<Your Partner ID>"
$ export BOWTIE_API_KEY="<Your Bowtie API Key>"
$ npm run server
```

Those two environment variables are required and have no defaults.  The
application will be available on your local machine at port 3001:
[http://localhost:3001/](http://localhost:3001/).

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

Once you have that in correspondence, simply start the test:

``` shellsession
$ npm run test
```

This will start a webdriver session with a fresh instance of Chrome and
will run through a scripted insurance application, submitting the
results at the end.  A successful result looks like this:

``` shell
[]    ✓ Should submit application form for home
[] 1 passing (19.4s)
Spec Files:      1 passed, 1 total (100% completed) in 00:00:20 
```

The test script is a simple loop that detects the kind of input being
used, and triggers it.  There are no delays written into the script,
highlighting the speed with which even a primitive Javascript
application can run in this sort of demanding environment.

## LICENSE

This repository constitutes "explanatory related materials for the
Bowtie SDK," and as such is covered under the Bowtie SDK END USER
LICENSE AGREEMENT.  [A copy of that license has been provided.](./LICENSE.md)
