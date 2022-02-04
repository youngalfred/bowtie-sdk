const daysFromNow = (when = 60) => {
    const today = Date.now();
    const nextsecond = today + when * 86400 * 1000;
    const nextday = new Date(nextsecond);
    return nextday.toISOString().substr(0, 10);
};

module.exports = {
    application: [
        ["start-firstName", "John"],
        ["start-lastName", "Testing-YA"],
        ["start-city", "Summerville"],
        ["start-state", "Florida"],
        ["start-streetAddress", "1234 Main St"],
        ["start-unit", "FL 12"],
        ["start-zipCode", "31024"],
        ["start-emailAddress", "john.johnson@email.com"],
        ["home-primaryPolicyHolder-birthDate", "1965-07-01"],
        ["home-primaryPolicyHolder-gender", "Male"],
        ["home-primaryPolicyHolder-maritalStatus", "Married"],
        ["home-primaryPolicyHolder-careerStatus", "Employed"],
        ["home-primaryPolicyHolder-occupation", "Bookkeeper"],
        ["home-secondaryPolicyHolder", "Yes"],
        ["home-secondaryApplicant-firstName", "Linda"],
        ["home-secondaryApplicant-lastName", "Johnson"],
        ["home-secondaryApplicant-birthDate", "1970-02-20"],
        ["home-secondaryApplicant-gender", "Female"],
        ["home-secondaryApplicant-maritalStatus", "Married"],
        ["home-secondaryApplicant-secondaryApplicantRelationship", "Spouse"],
        ["home-propertyType", "House"],
        ["home-propertyStyle-2", "Yes"],
        ["home-hasOccupants-_adults", "Yes"],
        ["home-occupants-adults", "2"],
        ["home-hasOccupants-_children", "Yes"],
        ["home-occupants-children", "3"],
        ["home-propertyUse-typeOfUse", "It's my primary home and I live here full time"],
        ["home-currentlyConstructionOnProperty", "Yes"],
        ["home-newBuildOrRenovation", "Renovation"],
        ["home-yearBuilt", "1949"],
        ["home-livingArea", "3200"],
        ["home-stories", "3"],
        ["home-bathrooms", "2.5"],
        ["home-constructionType-1", "Yes"],
        ["home-roof-roofMaterial", "Metal"],
        ["home-roof-roofMaterialType", "Tin"],
        ["home-roof-roofShape", "Flat"],
        // ["home-roof-roofAnyPartFlat", "No"],
        // ["home-roof-secondaryFlatRoof", "No"],
        ["home-solarPanels-hasSolarPanels", "Yes"],
        ["home-solarPanels-count", "10"],
        ["home-solarPanels-ownedOrLeased", "Owned"],
        ["home-solarPanels-panelArea", "75%"],
        ["home-fireplace-FireplaceOrSolidFuel", "Self Installed"],
        ["home-risks-fireHydrantWithin1000ft", "Yes"],
        ["home-risks-fireStationDistance", "1.5"],
        ["home-heating-primarySource", "Furnace"],
        ["home-heating-fuelType", "Oil"],
        ["home-heating-undergroundOilTank", "Yes"],
        ["home-heating-hasUpdate", "Yes"],
        ["home-heating-updateComplete", "Complete"],
        ["home-heating-updatedYear", daysFromNow(-4105).substr(0, 4)],
        ["home-electrical-hasUpdate", "Yes"],
        ["home-electrical-updateComplete", "Partial"],
        ["home-electrical-updatedYear", daysFromNow(-5840).substr(0, 4)],
        ["home-plumbing-hasUpdate", "Yes"],
        ["home-plumbing-updateComplete", "Complete"],
        ["home-plumbing-updatedYear", daysFromNow(-6935).substr(0, 4)],
        ["home-valuables-hasBelongingsOver2k-_computerEquipment", "Yes"],
        ["home-valuables-belongingsOver2k-computerEquipment", "> $10,000"],
        ["home-valuables-hasBelongingsOver2k-_jewelry", "Yes"],
        ["home-valuables-belongingsOver2k-jewelry", "$6,000"],
        ["home-valuables-totalValueOfBelongings", "50000"],
        ["home-estimatedNetWorth", "$100,000 - $200,000"],
        ["home-discounts-gatedCommunity-inGatedCommunity", "Yes"],
        ["home-discounts-gatedCommunity-mannedSecurityGates", "Yes"],
        ["home-discounts-gatedCommunity-passkeyGates", "Yes"],
        ["home-discounts-gatedCommunity-securityPatrol", "Yes"],
        ["home-discounts-gatedCommunity-singleEntry", "Yes"],
        ["home-windmit-hasReport", "Yes"],

        ["home-windmit-buildingCode", "B. The South Florida Building Code (SFBC-94) for HVHZ only (Miami-Dade and Broward county)"],
        ["home-windmit-bYearBuilt", "1949"],
        ["home-windmit-roofCoveringType-membrane", "Yes"],
        ["home-windmit-roofCoveringType-membrane-date", "07072005"], // MM DD YYYY
        ["home-windmit-roofCoveringType-membrane-Approval", "4878325"],
        ["home-windmit-roofCoveringType-membrane-InstallationYear", "1980"],
        // ["home-windmit-roofCoveringType-membrane-NoInfo", "Yes"],
        ["home-windmit-roofCovering", "C. One or more roof coverings do not meet the requirements of Answer 'A' or 'B'."],
        ["home-windmit-roofDeckAttachment", "B. Plywood/OSB roof sheathing with a minimum thickness of 7/16” inch attached to the roof truss/rafter (spaced a maximum of 24”inches o.c.) by 8d common nails spaced a maximum of 12” inches in the field.-OR- Any systemof screws, nails, adhesives, other deck fastening system or truss/rafter spacing that is shown to have an equivalent or greater resistance than 8d nails spaced a maximum of 12 inches in the field or has a mean uplift resistance of at least 103 psf."],
        ["home-windmit-roofToWallAttachment", "B. Clips"],
        ["home-windmit-bClips", "Metal connectors with a minimum of 1 strap that wraps over the top of the truss/rafter and does not meet the nail position requirements of C or D, but is secured with a minimum of 3 nails."],
        ["home-windmit-roofGeometry", "B. Flat Roof<br> Roof on a building with 5 or more units where at least 90% of the main roof area has a roof slope of less than 2:12. Roof area with slope less than 2:12"],
        ["home-windmit-bFlatRoofSlopeLessThan212", "90"],
        ["home-windmit-bFlatRoofTotalRoofArea", "320"],
        
        ["home-windmit-secondaryWaterResistance", "A. SWR (also called Sealed Roof Deck) Self-adhering polymer modified-bitumen roofing underlayment applied directly to the sheathing or foam adhesive SWR barrier (not foamed-on insulation) applied as a supplemental means to protect the dwelling from water intrusion in the event of roof covering loss."],
        ["home-windmit-openingProtection", "N. Exterior Opening Protection (unverified shutter systems with no documentation) All Glazed openings are protected with protective coverings not meeting the requirements of Answer “A”, “B”, or C” or systems that appear to meet Answer “A” or “B” with no documentation of compliance (Level N in the table above)."],
        ["home-windmit-openingProtectionN", "N.1 All Non-Glazed openings classified as Level A, B, C, or N in the table above, or no Non-Glazed openings exist"],

        ["home-propertyUse-farmingActivity", "No"],
        ["home-risks-trampoline", "Yes"],
        ["home-risks-swimmingPool-hasSwimmingPool", "Yes"],
        ["home-protectionSystems-hasBurglarAlarmSystem", "Yes"],
        ["home-protectionSystems-hasSprinklerSystem", "Yes"],
        ["home-protectionSystems-hasFireExtinguisher", "Yes"],
        ["home-protectionSystems-hasFireAlarmSystem", "Yes"],
        ["home-discounts-deadbolts", "Yes"],
        ["home-protectionSystems-hasSmokeDetector", "Yes"],
        ["home-risks-sumpPump", "Yes"],
        ["home-discounts-smokerFree", "Yes"],
        ["home-protectionSystems-hasCoDetector", "Yes"],
        ["home-deck-hasDeck", "Yes"],
        ["home-discounts-stormShutters", "Yes"],
        ["home-discounts-hailResistantRoof", "Yes"],
        ["home-protectionSystems-burglarAlarmSystemType", "Direct - Alerts Police Department"],
        ["home-protectionSystems-fireAlarmSystemType", "Direct - Alerts Fire Department"],
        ["home-protectionSystems-smokeDetectorType", "Hardwired"],
        ["home-protectionSystems-sprinklerSystemCoverage", "Partial, 75%"],
        ["home-deck-deckArea", "1200"],
        ["home-deck-material", "Redwood"],
        ["home-risks-trampolineSafetyNet", "No"],
        ["home-risks-swimmingPool-aboveGround", "Yes"],
        ["home-risks-swimmingPool-divingBoard", "No"],
        ["home-risks-swimmingPool-enclosedByFenceOver4ft", "No"],
        ["home-risks-swimmingPool-isScreened", "No"],
        ["home-risks-swimmingPool-slide", "Yes"],
        ["home-risks-swimmingPool-unfilledUnmaintained", "No"],
        ["home-risks-swimmingPool-latchingGate", "No"],
        ["home-risks-swimmingPool-moreThan1000ftAway", "Yes"],
        ["home-screenedEnclosure-hasScreenEnclosure", "No"],
        /*
        ["home-screenedEnclosure-attached", "Yes"],
        ["home-screenedEnclosure-enclosedArea", "1500"],
        ["home-screenedEnclosure-enclosedHeight", "10"],
        ["home-screenedEnclosure-requestedCoverage", "$50,000"],
        */
        ["home-dateOfPurchase", daysFromNow(-640)],
        ["home-previousAddress-city", "Smallville"],
        ["home-previousAddress-state", "California"],
        ["home-previousAddress-streetAddress", "550 Side St"],
        ["home-previousAddress-zipCode", "98765"],
        ["home-claimsLast5YearsCount", "1"],
        ["home-claims-0-date", daysFromNow(-400).substr(0, 7)],
        ["home-claims-0-peril", "Explosion"],
        ["home-claims-0-claimPayout", "3312"],
        ["home-carrierCanceledLast5years", "No"],
        ["home-exteriorSiding", "Cement Fiber"],
        ["home-interiorFinishingQuality", "Semi-Custom Grade"],
        ["home-foundation", "Slab"],
        ["home-garage-type", "Attached"],
        ["home-garage-size", "3 or more cars"],
        ["home-propertyUse-farmingActivity", "No"],
        ["home-propertyUse-portionLeasedTo3rdParty", "No"],
        ["home-risks-aluminumWiring", "No"],
        ["home-risks-eifsOrSyntheticStuccoSiding", "No"],
        ["home-risks-electricalFuseBox", "No"],
        ["home-risks-galvanizedPiping", "No"],
        ["home-risks-pexPipingPrior2010", "Yes"],
        ["home-risks-polybutylenePiping", "No"],
        ["home-risks-sinkholeOrEarthMovementLoss", "No"],
        ["home-risks-sumpPump", "Yes"],
        ["home-risks-unrepairedDamages", "Yes"],
        ["home-risks-unrepairedDamagesDescription", "Hole in the floor near dining room"],
        ["home-risks-historicalHome", "No"],
        ["home-risks-knobAndTubeOrClothWiring", "Yes"],
        ["home-risks-locatedInHistoricalDistrict", "No"],
        ["home-risks-moreThan100Amps", "Yes"],
        ["home-propertyUse-businessAtHome-homeBusiness", "Yes"],
        ["home-propertyUse-businessAtHome-businessType", "Artisan"],
        ["home-propertyUse-businessAtHome-customersVisitPerWeek", "50"],
        ["home-propertyUse-domesticWorkers", "No"],
        ["home-pets-hasPets-_akita", "Yes"],
        ["home-pets-countOf-_akita", "1"],
        ["home-pets-hasPets-_otherDogBreed", "Yes"],
        ["home-pets-pet-akita-0-bittenBefore", "No"],
        ["home-pets-pet-akita-0-insurePet", "Yes"],
        ["home-pets-pet-akita-0-name", "doggie"],
        ["home-pets-pet-akita-0-age", "5 years"],
        ["home-pets-pet-otherDogBreed-0-bittenBefore", "No"],
        ["home-pets-pet-otherDogBreed-0-insurePet", "Yes"],
        ["home-pets-pet-otherDogBreed-0-name", "Rex"],
        ["home-pets-pet-otherDogBreed-0-breed", "Mixed breed large (71+ lbs when full grown)"],
        ["home-pets-pet-otherDogBreed-0-mixedBreeds", "German Shepherd"],
        ["home-pets-pet-otherDogBreed-0-mixedBreeds", "Giant Schnauzer"],
        ["home-pets-pet-otherDogBreed-0-mixedBreeds", "Husky"],
        ["home-pets-pet-otherDogBreed-0-age", "2 years"],
        ["home-numberOfMortgages", "1"],
        ["home-propertyUse-isShortTermRental", "Yes"],
        ["home-propertyUse-shortTermRental-daysRentedOutPerYear", "100"],
        ["home-propertyUse-shortTermRental-entireHomeRentedOut", "Yes"],
        ["home-propertyUse-shortTermRental-maxRentersAtOneTime", "15"],
        ["home-propertyUse-shortTermRental-minimumLeaseTerm", "5 days"],
        ["home-propertyUse-shortTermRental-timesRentedOutPerYear", "25"],
        ["home-hasRecentPolicy", "Yes"],
        ["home-mostRecentPolicy-expirationDate", daysFromNow(60)],
        ["home-mostRecentPolicy-insurer", "AAA"],
        ["home-mostRecentPolicy-liability", "More than $300,000"],
        ["home-plan-requestedDeductible", "$1,500"],
        ["home-additionalCoverageRequests-flood", "Yes"],
        ["home-additionalCoverageRequests-jewelry", "Yes"],
        ["home-primaryPolicyHolder-phoneNumber", "7777777777"],
        ["home-plan-requestedPolicyStart", "On"],
        ["home-plan-requestedPolicyStartDate", daysFromNow(30)],
        ["home-mostRecentPolicy-annualPremium", "1234"],
        ["home-comments", "Some comment here..."],
        ["home-disclaimer", "Yes"],
    ],
};
