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
