![Express JS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Language: Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Language: TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JS Framework: Angular 12](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![JS Framework: Vue 3](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Topic: Web Development](https://img.shields.io/badge/topic-Web_Development-green.svg)
![Status: Beta](https://img.shields.io/badge/status-Beta-yellow.svg)

# The Young Alfred Bowtie SDK: Basic Implementation Demos

This repository contains several Young Alfred Bowtie SDK demos
that each implement the SDK using a different JavaScript framework
(or no framework at all). For more information related to each
framework's implementation, see the README.md within each JS framework's folder.

The Bowtie SDK provides all the knowledge, validation, and organization
necessary to guide a customer through the sometimes bewildering process
of applying for insurance. Insurance forms are complex, and customers
often struggle to understand whether any given section of an insurance
form is applicable to their situation. The Bowtie SDK is intended to
guide a customer through the process, using guidance questions to
restrict the form to only those questions necessary for their particular
circumstances.

The purpose of the Bowtie library is to grant you, as a Young Alfred
partner, the ability to build the Bowtie process into your existing web
application processes. Together, we can enhance the services you
provide and create a complete, secure, and even fun experience out of
the task of insuring the products you provide to your customers.

_This repository_ contains the most basic implementation of that
process. It is intended as a starting point and a reference for your
developers.

The examples in this repository are currently written to conform to
the _Young Alfred API 1.2021-10-25_.

## Running a demonstration

Each demonstration can be run on a single developer's machine and
requires no special hardware or access. Complete the following
steps to run a demonstration:

1. After cloning the repo, select a demo to run (ex: `cd angular/`)

2. You should update the `.npmrc` file nearest to the
   demo you are running by replacing `<github-auth-token>` with your actual
   github personal token. Keep in mind that the `<github-auth-token>` you use
   must have the `read:packages` scope, which allows you to download packages
   from GitHub Package Registry. If you omit an authToken in your `.npmrc`,
   you’ll encounter a 401 or 403 error when attempting to install the bowtie-sdk.

   For more info on creating a personal access token (we normally use classic
   tokens instead of fine-grained), see [GitHub's instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).

3. After updating the `.npmrc`, you can successfully run `npm install` to acquire all
   dependencies.

4. Set the `BOWTIE_API_KEY` and run the demo:

```shellsession
# Windows
$ export BOWTIE_API_KEY="<Your Bowtie API Key>" && npm run server

# Mac
$ BOWTIE_API_KEY="<Your Bowtie API Key>" npm run server
```

5. Visit [http://localhost:3001/](http://localhost:3001/)

_Note_: The `BOWTIE_API_KEY` environment variable is required and has no default value.

Each JavaScript demo relies on the node server found at [`/demo-server/index.js`](https://github.com/youngalfred/bowtie-sdk/blob/master/demo-server/index.js). You should run the server from the `/demo-server` directory ONLY if you wish to specify the `BOWTIE_STATIC_CONTENT` environment variable manually (with the path to your client build folder). Otherwise, stick to running `npm run server` from one of the JS client demos, which sets the `BOWTIE_STATIC_CONTENT` variable for you. The demo server includes under 200 lines of well-commented JS written using the [Express app server](https://expressjs.com/) framework.
Other environment variables that can alter the behavior of the server
include:

- `BOWTIE_API_URL`: This defaults to the Bowtie Developer Sandbox
- `BOWTIE_LOCAL_PORT`: The port on which the application runs

### Running the test

The test portion of the demonstration does require you to have a recent
version of chrome installed. The version listed in `/tests/package.json` is
Chrome 98; you may have to adjust this and re-run `npm install` to get
the correct driver for your installed version of Chrome.

Once you have that in correspondence, enter the `tests/` directory:

```shellsession
$ cd tests/
```

Then, simply start the test:

```shellsession
$ npm run test
```

This will start a webdriver session with a fresh instance of Chrome and
will run through a scripted insurance application, submitting the
results at the end. A successful result looks like this:

```shell
[]    ✓ Should submit application form for home
[] 1 passing (19.4s)
Spec Files:      1 passed, 1 total (100% completed) in 00:00:20
```

The test script is a simple loop that detects the kind of input being
used, and triggers it. There are no delays written into the script,
highlighting the speed with which even a primitive Javascript
application can run in this sort of demanding environment.

## LICENSE

This repository constitutes "explanatory related materials for the
Bowtie SDK," and as such is covered under the Bowtie SDK END USER
LICENSE AGREEMENT. [A copy of that license has been provided.](./LICENSE.md)
