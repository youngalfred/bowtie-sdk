import { construction } from "./construction";
import { dogs } from "./dogs";
import { exterior } from "./exterior";
import { interior } from "./interior";
import { extras } from "./extras";
import { family } from "./family";
import { foundation } from "./foundation";
import { garage } from "./garage";
import { heating } from "./heating";
import { house } from "./house";
import { icons } from "./icons";
import { policies } from "./policies";
import { roofmaterial } from "./roofmaterial";
import { roofshape } from "./roofshape";
import { updates } from "./updates";
import { additional_coverage } from "./additional_coverage";
import { coverages } from "./coverages";
import { planTypes } from "./plan_type";

export type DecorationRecord = Record<string, Record<string, string>>
export const defaultDecorator: DecorationRecord = {}
export const DECORATORS: DecorationRecord = {
    "extra-coverages": coverages,
    valuables: additional_coverage,
    constructionType: construction,
    occupants: family,
    "any-updates": updates,
    exteriorSiding: exterior,
    interiorFinishingQuality: interior,
    foundation: foundation,
    type: garage,
    fuelType: heating,
    propertyStyle: house,
    policyType: policies,
    primarySource: heating,
    propertyType: icons,
    roofMaterial: roofmaterial,
    roofShape: roofshape,
    pets: dogs,
    extras: extras,
    icons: icons,
    requestedPlanType: planTypes,
};
