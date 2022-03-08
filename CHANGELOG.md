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
* file upload capability for insurance declarations (file fields expect values that look like: `'{"file1.name": "fileId1", "file2.name": "fileId2", ...}'`); fileIds are provided by the tlano API's `/v1/file` endpoint.
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
