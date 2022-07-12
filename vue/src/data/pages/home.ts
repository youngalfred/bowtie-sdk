import type { StartStopPair } from "."

export type HomeSection = 'get-started' | 'applicant-details' | 'policy-details' | 'property-details' | 'home-summary'
export const getStarted: StartStopPair = ['get-started', 'policy-type']
export const home1: StartStopPair = ['birthdate', 'family-units|occupants']
export const home2: StartStopPair = ['property-usage', 'farm-activity']
export const home3: StartStopPair = ['extras', 'short-term-rental']
export const home4: StartStopPair = ['plan-type|extra-coverages', 'ya-disclaimer']

export const homePagesRecord: Record<HomeSection, StartStopPair> = {
    "get-started": getStarted,
    "applicant-details": home1,
    "property-details": home2,  
    "policy-details": home3,  
    "home-summary": home4,  
}

