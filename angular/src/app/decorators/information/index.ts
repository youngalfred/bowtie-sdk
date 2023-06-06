import imagePairs from './images'
import markdownPairs from './markdowns'

export type Info = Record<string, string> // [sdk field or field group id, additional info]
const info: Info = {
  'start.streetAddress': 'Use the address that needs insurance.',
  'secondary-policy-holder': [
    'If your spouse or anyone living in your home is also listed on',
    "the home's deed, that person needs to be added as a second",
    'policyholder.',
  ].join(' ') as string,

  'square-footage': 'If you do not know, please provide an estimate.',
  'home.estimatedNetWorth': 'Not counting home and retirement accounts.',
  'home.discounts.gatedCommunity.inGatedCommunity': 'This will apply a discount.',
  'home.propertyUse.domesticWorkers': 'Nanny, cook, etc.',
  'home.unitsPerFloor': 'If you are unsure, please estimate.',
  'home.floorsInBuilding': 'Think of all those elevator buttons.',
  'home.primaryPolicyHolder.phoneNumber': "Don't worry. We won't call you.",
  'recommended-hoa-coverage':
    'Dwelling coverage protects everything within the walls of your unit, think toilet, countertops, flooring.',
  'home.plan.requestedPlanType-basic': 'I will sacrifice coverage to save money',
  'home.plan.requestedPlanType-standard': 'I’m happy with a normal amount of coverage',
  'home.plan.requestedPlanType-premium': 'I want the fullest protection available',
  ...markdownPairs,
}

const imageInfo = imagePairs

export { imageInfo, info }
