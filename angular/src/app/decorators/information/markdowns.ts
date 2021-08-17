import { Info } from ".";

const economyGrade = `
**Cabinets:** Economy grade cabinets usually have the cheapest
particleboard. Only serving functional purposes, these cabinets have
little to no attention to detail.

**Counters:** Countertops in economy grade homes have the least expensive
plastic or laminate fixed to a low-quality plywood base.

**Facilities:** Economy grade interiors include minimal facilities with a
stove/oven, sink, and refrigerator in the kitchen. The bathroom has a
basic quality toilet, shower/tub, sink, and mirror.

**Fixtures:** The fixtures include minimal quality plumbing and wiring,
low-cost lighting, and limited electrical outlets.

**Floors:** Floors are made of the least expensive wood and may use
inexpensive vinyl, carpeting, or other cheap material.
`;

const buildersGrade = `
**Cabinets:** Builder's grade cabinets are standard quality plywood or
fiberboard. These cabinets tend to be mass-produced and may have a
plastic or wooden veneer.

**Counters:** The countertop is ceramic tile or laminated plastic on a
particleboard base. These counters have average quality materials.

**Facilities:** Builder's grade facilities will include standard-quality
appliances such as an oven, stove, refrigerator, sink, dishwasher,
garbage disposal, and exhaust fan in the kitchen. Similarly, the
bathroom will have a cast iron or synthetic tub/shower, ceramic or
synthetic countertops, a standard toilet bowl, single vanity, towel bar,
framed mirror, and medicine cabinet.

**Fixtures:** Builder's grade homes have essential light and plumbing
fixtures using mass-produced and pre-built options. These homes have
adequate light fixtures and minimal electrical outlets.

**Floors:** The floors have wood or steel joints. Common floor coverings
include low-cost carpet, vinyl, or hardwood and cost between **$2 to $7
per square foot.**
`;

const semicustomGrade = `
**Cabinets:** Instead of plywood, semi-custom cabinets are wood. The
cabinet design may be pantry-style and have corner cabinets with
revolving doors. Semi-custom cabinets can offer more precise fits for
your kitchen.

**Counters:** Semi-custom countertops and backsplashes have laminated
plastic or solid surfaces that are higher quality than economy
countertops.

**Facilities:** The facilities of semi-custom homes include the same
appliances and fixtures as builder's grade interiors. However, these
items are of higher quality than economy features and have additional
features. For example, a drinking water filter, recessed medicine
cabinet, non-slip surfaces, and elongated toilet bowl are some
facilities typical of semi-custom builds. The most common toilets are
'comfort height,' and are 17 to 19 inches high.

**Fixtures:** Semi-custom interiors have above average fixtures and
additional outlets.

**Floors:** A suitable combination of decent quality hardwood, vinyl,
carpet, and ceramic tile are typical of semi-custom interiors.
`;

const customGrade = `
**Cabinets:** Custom cabinets, pantries, and islands are made of
high-quality materials by cabinetmakers. A solid bolt construction,
beams, heavy-duty fasteners, and three-way adjustment hinges are
standard features.

**Counters:** Custom counters are high-end synthetic marble or ceramic
tile.

**Facilities:** High-quality appliances, a second oven, a built-in vent
hood, and a tap for boiling water are common custom-grade
finishings. Bathrooms will have features such as a spa tub, colored
enamel, two sinks, marble countertops, solid wood cabinets, two recessed
mirror cabinets, and recessed toilet paper holders.

**Fixtures:** Typically, custom interiors have the maximum number of
high-quality fixtures, expensive lighting, and professional
craftsmanship.

**Floors:** A combination of high-end solid hardwood flooring, tiles, and
vinyl is typical for custom grade homes.
`;

const floodCoverage = `**Flood Coverage:** Flood coverage is not
included in your standard home insurance policy. Flood insurance is
sponsored by the National Flood Insurance Program (NFIP). While it isn't
federally required in moderate-risk areas, it's still a good idea. In
fact, people in these areas file more than 20 percent of all NFIP flood
insurance claims.`;

const waterBackupCoverage = `**Water Backup:** Homeowners policies do not
cover losses from water that overflows from sump pumps or water that
backs-up through sewers or drains. This add-on provides coverage for
such incidents.`;

const personalPropertyCoverage = `**Personal Property Replacement Costs:** 
Your personal property depreciates, so if you have to file a
claim, you might not get enough cash to buy the property new. This
coverage ensures that you can replace property at the cost of buying it
new.`;

const moldCoverage = `**Mold Coverage:** Mold coverage is excluded from
all Homeowners policies. The mold insurance add-on provides coverage for
property damage and liability losses arising out of fungi, wet or dry
rot, or bacteria.`;


export const keysAndTexts: Info = {
    "home.interiorFinishingQuality-economy": economyGrade,
    "home.interiorFinishingQuality-builder": buildersGrade,
    "home.interiorFinishingQuality-semiCustom": semicustomGrade,
    "home.interiorFinishingQuality-custom": customGrade,
    "home.additionalCoverageRequests.flood": floodCoverage,
    "home.additionalCoverageRequests.waterBackup": waterBackupCoverage,
    "home.additionalCoverageRequests.personalProperty": personalPropertyCoverage,
    "home.additionalCoverageRequests.mold": moldCoverage,
};

export default keysAndTexts;
