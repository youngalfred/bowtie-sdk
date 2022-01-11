## 1.1.0 (January 11, 2022)
The 11-05 api release primarily includes changes to the pets section but also features four new home insurers, jewelry itemized additional coverage, and an option to say the home was not built by an accredited builder. Consider the following sdk changes as your GUI product may also require updates to accommodate the api's 11-05 release:
* the pets section now asks if customers would like to insure their pet(s) and requires the pet's age when customers choose to insure that pet.
* Insurance applicants must clarify a dog's breed(s) through follow-up questions after claiming an "other breed" dog.
* Itemized jewelry coverage becomes available only after the applicant claims jewelry belongings worth more than $2k and then requests additional coverage on jewelry.

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
* `portfolio.submit()` to throw an error when portfolio state is invalid. 
### Fixed:
* bugs related to deriving home residency and driver birthdate information from peer home portfolio (in home + auto portfolios).

## 1.0.6 (December 6, 2021)
### Added:
* file upload capability for insurance declarations (file fields expect values that look like: `'{"file1.name": "fileId1", "file2.name": "fileId2", ...}'`); fileIds are provided by the tlano api's `/v1/file` endpoint.
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
