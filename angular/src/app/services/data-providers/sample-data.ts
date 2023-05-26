import type { InputFieldType } from '@youngalfred/bowtie-sdk';
import { OptionType } from '@youngalfred/bowtie-sdk';
import { AutoIdentity } from '@youngalfred/bowtie-sdk/build/third-party/auto/types';

const hintsWithoutDetails = (...values: string[]) => values.map(value => ({ value, details: {} }));
const makeOptionsFrom = (...values: string[]): OptionType[] => values.map(value => ({ name: value, label: value }));

export const homePropertyData: Record<string, InputFieldType["hints"]> = {
    // Use the "details" object to pass data you may want to render in your UI.
    // For example, you may find it useful to note the street, city, or zip code
    // of the nearest fire station to your customers after pre-filling the fire
    // station distance field with a value of "1.10". However, details are largely unnecessary.
    "home.risks.fireStationDistance": [
      {
        value: "1.10",
        details: {
          name: "Test Fire Station",
          street: "128 S St",
          city: "Somewhere Fake",
          state: "Middle of No Where",
          zip: "88888",
        },
      },
    ],
    "home.propertyType": hintsWithoutDetails("House", "TownHome"),
    "home.propertyUse.typeOfUse": hintsWithoutDetails("primary"),
    "home.propertyStyle": hintsWithoutDetails("cottage", "queenAnne"),
    "home.currentlyConstructionOnProperty": hintsWithoutDetails("yes"),
    "home.newBuildOrRenovation": hintsWithoutDetails("yes"),
    "home.constructionType": hintsWithoutDetails("stuccoWoodframe"),
    "home.interiorFinishingQuality": hintsWithoutDetails("builder"),
    "home.foundation": hintsWithoutDetails("hillsideFoundation"),
    "home.exteriorSiding": hintsWithoutDetails("stucco"),
    "home.garage.type": hintsWithoutDetails("attached"),
    "home.garage.size": hintsWithoutDetails("n2"),
    "home.heating.primarySource": hintsWithoutDetails("furnace", "boiler"),
    "home.heating.fuelType": hintsWithoutDetails("electric"),
    "home.risks.swimmingPool.hasSwimmingPool": hintsWithoutDetails("yes"),
    "home.risks.swimmingPool.aboveGround": hintsWithoutDetails("no"),
    "home.risks.swimmingPool.enclosedByFenceOver4ft": hintsWithoutDetails("no"),
    "home.roof.roofShape": hintsWithoutDetails("gable", "hip"),
    "home.roof.roofMaterial": hintsWithoutDetails("rubber", "membrane"),
    "home.yearBuilt": hintsWithoutDetails("2020"),
    "home.bathrooms": hintsWithoutDetails("n2"),
    "home.livingArea": hintsWithoutDetails("2277"),
    "home.dateOfPurchase": hintsWithoutDetails("2020-08-17"),
    "home.purchasePrice": hintsWithoutDetails("285001"),
    "home.stories": hintsWithoutDetails("n2"),
    "home.numberOfMortgages": hintsWithoutDetails("n2"),
};

export const autoIdentity: AutoIdentity = {
    bodyType: "Sport Utility Vehicle (SUV)/Multi-Purpose Vehicle (MPV)",
    make: "TOYOTA",
    model: "4-Runner",
    year: "1988",
}

export const autoMakes: OptionType[] = makeOptionsFrom(
    "ACURA",
    "AUDI",
    "BMW",
    "BUICK",
    "CADILLAC",
    "CHEVROLET",
    "CHRYSLER",
    "DAEWOO",
    "DODGE",
    "FORD",
    "GMC",
    "HONDA",
    "HYUNDAI",
    "INFINITI",
    "ISUZU",
    "JAGUAR",
    "JEEP",
    "KIA",
    "LEXUS",
    "LINCOLN",
    "MAZDA",
    "MERCEDES BENZ",
    "MERCURY",
    "MITSUBISHI",
    "NISSAN",
    "OLDSMOBILE",
    "PLYMOUTH",
    "PONTIAC",
    "PORSCHE",
    "LAND ROVER",
    "SAAB",
    "SATURN",
    "SUBARU",
    "SUZUKI",
    "TOYOTA",
    "VOLKSWAGEN",
    "VOLVO",
);

export const autoModels: OptionType[] = makeOptionsFrom(
    "CENTURY CUSTOM",
    "CENTURY LIMITED",
    "LESABRE CUSTOM",
    "LESABRE LIMITED",
    "PARK AVENUE",
    "PARK AVENUE ULTRA",
    "REGAL GS/REGAL GSE",
    "REGAL LS",
    "RIVIERA",
);

export const autoBodyTypes: OptionType[] = makeOptionsFrom(
    "4-Door Sedan",
    "Utility Vehicle - Two-Wheel Drive 2-Door",
    "Utility Vehicle - Two-Wheel Drive 4-Door",
    "Utility Vehicle - Four-Wheel Drive 2-Door",
    "Utility Vehicle - Four-Wheel Drive 4-Door",
);