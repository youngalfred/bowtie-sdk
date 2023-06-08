## 2.0.0 (July 11, 2022)

#### Portfolio Initialization & Sdk Config
Prior to this change, the portfolio constructor accepted two arguments:
    1. an application (you might have used this parameter to initialize a portfolio with values based on a app stored in local storage between user sessions, as each of the Bowtie demos showcase)
    2. a data model, which is the root field group of the tree of insurance questions (you've probably never used this argument before and you likely never will; in theory, you could render a completely different set of questions, assuming you're familiar with the internal field group api)

We've updated the portfolio's constructor to accept an sdk config, which is an object with the following properties (if you use TypeScript, you can import and take a look at the config type: `BowtieSdkConfig`):
- application: this is the same as the previous constructor's first argument; it's simply an existing application (or a set of sdk answers) to base the newly created portfolio.
- dataModel: this is the same as the previous constructor's second argument. You are not likely to use this property.
- apiUrls: this is new. The sdk can be configured to send submission and auto retrieval requests to your proxy server. The apiUrls property allows you to specify the endpoint paths. For example, if the submit endpoint on your proxy server is `/api/v2/premium/insurance/submit`, you would specify this endpiont path by the following:

```
apiUrls: {
    submit: '[the-host-if-necessary]/api/v2/premium/insurance/submit',
    // You can also specify paths for api calls related to fetching and
    // filling the car identity sections of an auto application:
    // getAutoByVin
    // getAutoMakesByYear
    // getAutoModelsByYearAndMake
    // getAutoBodyTypesByYearMakeAndModel
}
``` 
- retryErrorCodes: this is also now. This property is an object with the same properties as `apiUrls` (submit, getAutoByVin, etc...). However, the value associated with each api call is an array of http error status codes. If or when these status codes are encountered during network requests, the sdk will attempt to retry the request (up to two more times, yielding three possible attempts in total).
The sdk will also retry requests that fail to begin or requests that receive no response. If you omit an http status array for a given api call (submit, for example), the request will only be retried when it fails to send or when no response is received. The sdk will retry failed network requests two times at most, no matter what caused the error.

The portfolio object can be initialized correctly with either a missing, empty, partial, or complete sdk config.

#### Submission
If you haven't been using the portfolio's submit method, now is the time to begin! We have made the method more friendly and, uh, usable in hopes that you'll adopt it. Also keep in mind, if you choose not to use the portfolio.submit() method, you will need to manage the `bowtie-api-version` header yourself when submitting to the Bowtie API. That is more work than we plan for you to take on, and we handle that already inside the sdk's submit method--just remember to forward the header when submitting from your proxy server to the Bowtie API.

For more context, the sdk has always contained a `portfolio.submit()` method that would bundle the portfolio payload and ship it to a proxy server. If you are already aware of this function, you probably chose not to use it... and we don't blame you. The previous `.submit()` method dictated how you wrote your proxy server by requiring the submit endpoint to be located at `/api/v1/submit`, and it only sent the request headers we specified internally. Meaning, if your proxy server requires authentication before accepting requests, you could not use portfolio.submit(). Another frustration of the old implementation is that it swallowed the original http error and simply returned an object with a boolean `isSuccess` property. It really wasn't helpful for understanding what went wrong. Lastly, the old submit() function required an integration and a session token (as the first two arguments), which might have left you confused. There was no explanation for those arguments, and the function no longer requires those arguments.

We've already addressed the issue of dictating the path of your submit endpoint by offering the `apiUrls` option in the `BowtieSdkConfig`. As for passing custom headers, the new submit method accepts an optional options object that can be used as such:

```
portfolio.submit({
    headers: {
        'x-session-id': state.sessionId,
        'Authorization': 'Bearer ${state.token}',
        // anything else you want to specify
    }
})
```
In addition to the headers you provide, we set the `'Content-Type'` to `'application/json'` AND, more importantly, the `bowtie-api-version` header, which you should simply forward along when submitting from your proxy server to the Bowtie API.

The submit method now throws an exception when the request fails (after all the retries have failed) so that you can handle it as you wish. The exception object is encompassed in the SubmitError type, and has the following properties:
```
{
    message: string;
    code: string;
    data?: Object,
    statusCode?: number;
    statusText?: string;
}
```
If you are unfamiliar with TypeScript, the `?` character marks properties as optional or possibly `undefined`.

As of this release, the request body sent from portfolio.submit() is a JSON object with a single `application` property. Meaning, if you are using the Express framework for your proxy server, you can access the object with `req.body.application`, whereas in prior sdk versions, you would have accessed it with `req.body.data.application`.

#### Auto APIs
The portfolio object now has four new methods that will fetch auto data and either update the auto's identity or update its options for the insurance applicant to select from. We recommend using the Bowtie API as the source of auto years, makes, models, and body types, but you may retrieve data from any source as long as your data conforms to the SDK's expected type and format:
- fillAutoWithVinData: the auto for which you are fetching data must already have a 17-digit vin number associated with it before the sdk will allow the request
- updateAutoMakeOptions
- updateAutoModelOptions
- updateAutoBodyTypeOptions
Note: if the Bowtie API is your automobile data source, the year must be between 1981 and the current year for the make, model, and body type queries.

When invoking these methods from your UI, you must specify the index of the auto you wish to get data for as well as a result mapper that converts the data from your source to the object or options list used by the sdk:
```
await portfolio.updateAutoModelOptions(idxOfAuto, {
    resultsMapper: (data) => data.models.map(({ model }) => ({ name: model, label: model })),
    headers: {
        'x-integration-token': state.integrationToken,
        'x-session-id': state.sessionId,
    }
})
```


### Added
- the ability to retry failed api requests (max of 3 attempts):
    - getAutoBodyTypesByYearMakeAndModel
    - getAutoByVin
    - getAutoMakesByYear
    - getAutoModelsByYearAndMake
    - submit
- portfolio methods for updating the list of options for automobile makes, models, and body types
- a portfolio method to retrieve and set an auto's year, make, model, and body type based on its 17-digit vin number
- a portfolio._overwriteField method (ex: `_overwriteField(fieldname, { kind: 'text', ...otherOverrides })`)
    - we do not recommend using this method outside of the example we provide, which shows how to change the auto make, model, and body type fields from select fields to text fields to ensure customers can complete the form even if the auto API endpoints experience an outage.
- a `forced` attribute to fields, which indicates when the field (or a dependency of this field) is being controlled internally
- `SubmitError` type

### Changed
- the Portfolio constructor to accept an optional `BowtieSdkConfig`
- the `ISubmitResult` type (removed `isSuccess` and `errors`)
- `Portfolio.submit()` now throws submissions errors for UIs to handle
- disclaimer field labels and links (at the end of applications) have been updated to most recent versions of documents on Credible Lab’s site
- wind mitigation validation (appears in FL only) to be me much less strict (the API received the same treatment, which allowed the sdk to not require answers for wind mit questions)
- the values associated with the list of mobile home foundation options (the option names used to have an unnecessary ‘-M’ suffix that has been removed)

### Fixed
- Minor bugs in the sdk to api communication layer to ensure portfolio can be parsed by the api. There were times when we sent an empty string but the sdk expected null, etc…
    - For example, if the customer reports he/she is married or has a domestic spouse, the applicant is forced to add a secondary policyholder
- validation on the discount available to Utah auto applicants when no one in the household consumes alcohol
- validation on screened enclosure coverage amount (question appears and is required for customers in FL, TX, GA)
- validation for address blocks throughout to allow international (non-US) addresses where it makes sense
    - for home portfolios, the only addresses that can be based outside of US is the previous address OR the primary address, for secondary homes
    - Auto portfolios can have a starting international address, but the lien holder for customer’s vehicles must be based in same country as customer. Also, the vehicle must be registered in a US state (to be insured in the US), regardless of customer's address.

## 1.5.0 (February 24, 2022)

To conform with api version 2022-01-07, several sdk enum values have been changed in this release. Additionally, auto insurance applicants will now select one or many vehicle uses (food delivery, ride share, conventional, and/or other), instead of just one.

### Changed:
* "Gulf Stream" home insurer option (found in the most recent policy section) to "Gulfstream".
* "What company(s) do you work for?" from a single select field to a group of select fields.
* requested tort from a boolean to an enum-based value (tort applies only to auto portfolios in PA & NJ). 

## 1.4.0 (February 22, 2022)

Version 1.4.0 includes minor bug fixes and changes that conform the sdk to api version 2021-12-22.

### Added:
* new "other" comprehensive claim option (auto).

### Changed:
* Michigan auto field ("Exclude drivers from PIP Medical Expense Coverage?") to optional.

### Fixed:
* email fields (within with each policy) by projecting the start section's email onto each home and auto policy.
* wind mitigation follow-up fields to disappear when changing start state from Florida to another state.

## 1.3.0 (February 10, 2022)

Similar to version 1.2.0, version 1.3.0 introduces only internal changes to the communication layer between the sdk and api. During portfolio submission, the sdk renames the ids of drivers and applications to "id", instead of "driverId" and "applicationId." You can continue to use the sdk as you did in version 1.2.0.

## 1.2.0 (February 3, 2022)

Most changes contained in bowtie-sdk version 1.2.0 are related to the communication layer between the sdk and api, and will therefore not affect your product.
However, you should be aware that the wind mitigation field group has been updated significantly. The sdk now validates and offers useful
labels to each wind mitigation field. Also note that fields are now divided into seven sections represented by the same seven sections listed on the paper form (1. Building code, 2. Roof covering, etc...) instead of a flat list of fields.
### Added:
* validation and labels to each field in the wind mitigation section.
* improved rules that dictate when sub-fields should appear in the wind mitigation section.

## 1.1.0 (January 11, 2022)
The 2021-11-05 API release primarily includes changes to the pets section but also features four new home insurers, jewelry itemized additional coverage, and an option to say the home was not built by an accredited builder. Consider the following SDK changes as your GUI product may also require updates to accommodate the API's 2021-11-05 release:
* the pets section now asks if customers would like to insure their pet(s) and requires the pet's age when customers choose to insure that pet.
* Insurance applicants must clarify a dog's breed(s) through follow-up questions after claiming an "other breed" dog.
* Itemized jewelry coverage becomes available only after the applicant claims jewelry belongings worth more than $2k and then requests additional coverage on jewelry.

Also note that prior to version 1.1.0, the SDK incorrectly allowed invalid applications to be submitted via the `.submit()` method. This is no longer the case. You should always verify that an application is valid before calling `.submit()`.  Calling `.submit()` on an invalid application will now throw an exception.

### Added:
* itemized additional coverage for jewelry items to match API version 2021-11-05.
* mixed dog breeds and multi-breed selection to match API version 2021-11-05 (multi-select fields expect values that look like: `'{"option.label1": "option.value1", "option.label2": "option.value2", ...}'`).
* "insure pet?" and "pet age?" follow-up questions for all pets to match API version 2021-11-05.
* animal liability additional coverage option to match API version 2021-11-05.
* four home insurers now included in Young Alfred to match API version 2021-11-05.
* "No" option (for accredited home builders) to match API version 2021-11-05.
* more specific validation messages to date fields.
### Changed:
* belongings value fields (fur, computer equipment, jewelry, etc...) by not requiring value and defaulting to `n2kGt`.
* `portfolio.submit()` to throw an exception when portfolio state is invalid. 
### Fixed:
* bugs related to deriving home residency and driver birthdate information from peer home portfolio (in home + auto portfolios).

## 1.0.6 (December 6, 2021)
### Added:
* file upload capability for insurance declarations (file fields expect values that look like: `'{"file1.name": "fileId1", "file2.name": "fileId2", ...}'`); fileIds are provided by the Bowtie API's `/v1/file` endpoint.
* question that asks in which state the vehicle is registered.
* several home insurers now included in Young Alfred.
* several accredited contractors to home builders table.
* country field to get started, primary, and previous addresses.
* validator to enforce minimum age of automobile insuree.
### Changed:
* date validators to enforce ISO-8660 format.
* wind mitigation section to correspond to API version 2021-10-25.
* drivers license to optional
* validation on state automobile coverage minimums.

## 1.0.4 (October 26, 2021)

### Added:
* two follow-up questions to the recent claims field group
* two home construction types
### Changed:
* update type field to default to "partial" (for updates to water heater, heating, electrical, etc...)
* default number of adult (home) occupants to two when a secondary policyholder exists
* id of the vacant coverage field group
* labeling of field number options (ex: >6 -> 6+)
* house type field group options based on house popularity
* dog breed field classes attribute to signal that the field's input should be rendered as input field, and NOT a text area
* two secondary policyholder field groups into a single fieldgroup
* default value for date of customer's last policy to a little more than one year ago from today
* enum value of one existing home construction type
### Fixed:
* Doberman Pincher enum value by conforming to Bowtie API (dobermanPinscher -> doberman)
* gated community field by requiring an answer
* farm/ranch field by requiring an answer
* primary address - the address should be sent to API based on customer's answer to the "property use" field

## 1.0.3 (July 25, 2021)

### Fixed:
* bug where the interior finishing quality is not sent to API (for condos and townhomes only) 
