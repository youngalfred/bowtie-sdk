![Language: Javascript](https://img.shields.io/badge/language-Javascript-green.svg)
![Topic: Web Development](https://img.shields.io/badge/topic-Web_Development-green.svg)
![Status: Beta](https://img.shields.io/badge/status-Beta-yellow.svg)

# The Young Alfred Bowtie SDK: Basic Implementation Demos

This repository contains several Young Alfred Bowtie SDK demos
that each implement the SDK using a different JavaScript framework
(or no framework at all). For more information related to each
framework's implementation, see the README.md within each JS framework's folder.

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
application processes. Together, we can enhance the services you
provide and create a complete, secure, and even fun experience out of
the task of insuring the products you provide to your customers.

*This repository* contains the most basic implementation of that
process. It is intended as a starting point and a reference for your
developers.

The examples in this repository are currently written to conform to
the *Young Alfred API 1.2021-10-25*.

## Running a demonstration

Each demonstration can be run on a single developer's machine and
requires no special hardware or access.

After unpacking this archive, complete the following steps to run a demonstration:
1. Choose a demonstration to run (ex: `cd angular/`)
2. Run `npm install` to acquire all dependencies
3. Open a new terminal session
4. Set the BOWTIE_API_KEY environment variable: `export BOWTIE_API_KEY="<Your Bowtie API Key>"`
5. Run `npm run server`
6. Visit [http://localhost:3001/](http://localhost:3001/)

*Note*: The BOWTIE_API_KEY environment variable is required and has no default.

The server within each JS demonstration is less than a hundred lines of
well-commented Javascript, written using the [Express app server](https://expressjs.com/) framework.
Other environment variables which can alter the behavior of the server
include:

- `BOWTIE_API_URL`: This defaults to the Bowtie Developer Sandbox.
- `BOWTIE_LOCAL_PORT`: The port on which the application runs
- `BOWTIE_STATIC_CONTENT`: The folder in which the client application
  will be found.
  
### Running the test

The test portion of the demonstration does require you have a recent
version of chrome installed. The version listed in `package.json` is
Chrome 94; you may have to adjust this and re-run `npm install` to get
the correct driver for your installed version of Chrome.

Once you have that in correspondence, enter the `tests/` directory:

``` shellsession
$ cd tests/
```

Then, simply start the test:

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
