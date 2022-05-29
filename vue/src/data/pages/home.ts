import type { StartStopPair } from "."

export type HomeSection = 'get-started' | 'applicant-details' | 'policy-details' | 'property-details'
export const getStarted: StartStopPair = ['get-started', new Set(['policy-type'])]
export const home1: StartStopPair = ['birthdate', new Set(['family-units', 'occupants'])]
export const home2: StartStopPair = ['property-usage', new Set(['farm-activity'])]
export const home3: StartStopPair = ['extra-coverages', new Set(['ya-disclaimer'])]

export const homePagesRecord: Record<HomeSection, StartStopPair> = {
    "get-started": getStarted,
    "applicant-details": home1,
    "property-details": home2,  
    "policy-details": home3,  
}

