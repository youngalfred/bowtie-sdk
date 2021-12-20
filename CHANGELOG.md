## 1.0.7 (December 20, 2021)

* Added itemized jewelry additional coverage questions to match API version 2021-11-05.
* Added mixed dog breeds and multi-breed selection to match API version 2021-11-05 (multi-select fields expect values that look like: '{"option.label1": "option.value1", "option.label2": "option.value2", ...}').
* Added animal liability additional coverage option to match API version 2021-11-05.
* Added "insure pet?" and "pet age?" follow-up questions to match API version 2021-11-05.
* Added "insure pet?" and "pet age?" follow-up questions to match API version 2021-11-05.
* Added several home insurers now included in Young Alfred to match API version 2021-11-05.
* Added "none" option (for accredited home builders) to match API version 2021-11-05.
* Added new default belongings value: `n2kGt`.
* Added more specific error messages to date fields.
* Fixed bugs related to deriving home residency and driver birthdate information from peer home portfolio (in home + auto portfolios).

## 1.0.6 (December 6, 2021)

* Update date validators to ensure they're in ISO-8660 format.
* Update Wind Mitigation to correspond to API version 2021-10-25
* Include Country field when sending address.
* Added several insurers now included in Young Alfred.
* Provide upload capability for insurance declarations (file fields expect values that look like: '{"file1.name": "fileId1", "file2.name": "fileId2", ...}'); fileIds are provided by the tlano api's `/v1/file` endpoint.
* Corrected state automobile coverage minimums.
* Check minimum age of automobile insuree.
* Drivers license is now optional
* Ask for state of vehicle registration.
* Added several accredited contractors to home builders table.

## 1.0.4 (October 26, 2021)

* Now defaulting the Update Type to "partial" (for updates to water heater, heating, electrical, etc...)
* Updated Doberman Pincher enum value to conform to Bowtie API (dobermanPinscher -> doberman)
* Now defaulting the number of adult occupants living in the home to two when a secondary policyholder exists
* Require an answer on the Gated Community field group
* Require an answer on the Farm/Ranch field group
* Re-mapped the id of the Vacant Coverage field group
* Improved the labeling of field number options (ex: >6 -> 6+)
* Reordered the house type field group options based on house popularity
* Updated the dog breed field's classes attribute to signal that the field's input should be rendered as input field, and NOT a text area
* Consolidated the two Secondary Policyholder field groups into a single fieldgroup
* Added two new questions to the Recent Claims field group
* Correctly sending the primary address to API based on customer's answer to the Property Use field
* Now defaulting the date of customer's Last Policy to a little more than one year ago from today
* Added two new home construction types and edited one existing construction type

## 1.0.3 (July 25, 2021)

* Fixed issue where the interior finishing quality data was failing to send to API (for condos and townhomes only) 
