![Language: TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JS Framework: React](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=for-the-badge)

# The Young Alfred Bowtie SDK: A Basic React Implementation Demo

This repository is different than the other demos found in the repository. Instead of
implementing a complete, customer-facing UI, this demo implements a basic UI your
organization might use internally. The UI prompts you for basic information
required by the Bowtie API before accepting a partial application.

Your organization's might do something similar to start applciations on behalf of customers
by answering a number of basic questions about the customer before submitting the partial application.Once submitted, the Bowtie API triggers an email (it parses the partial portfolio to find the customer's email) inviting the customer to continue his/her application on Credible. This demo asks for the following
information about a customer before allowing you to submit a partial application to the Bowtie API:

1. customer's insurance policy type (home, auto, or home & auto)
2. customer's email
3. customer's first name
4. customer's birthday

## The implementation

In the `./src` folder, you will find a complete React implementation of the
application process.

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

1. After cloning the repo, you should update the `.npmrc` file by replacing
   `<github-auth-token>` with your actual github personal token. Keep in mind
   that the <github-auth-token> you use must have the `read:packages` scope,
   which allows you to download packages from GitHub Package Registry. If
   you omit an authToken in your `.npmrc`, you’ll encounter a 401 or 403 error
   when attempting to install the bowtie-sdk.

   For more info on creating a personal access token (we normally use classic
   tokens instead of fine-grained), see [GitHub's instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic).

2. After updating the `.npmrc`, you can successfully run `npm install` to acquire all
   dependencies.

3. Next, run the following:

```shellsession
# Windows
$ export BOWTIE_API_KEY="<Your Bowtie API Key>" && npm run server

# Mac
$ BOWTIE_API_KEY="<Your Bowtie API Key>" npm run server
```

_Note_: The BOWTIE_API_KEY environment variable is required and has no default.

4. Visit [http://localhost:3001/](http://localhost:3001/) to see the running application.

## LICENSE

This repository constitutes "explanatory related materials for the
Bowtie SDK," and as such is covered under the Bowtie SDK END USER
LICENSE AGREEMENT. [A copy of that license has been provided.](./LICENSE.md)
