import type { StartStopPair } from "."

const emptySet = new Set<string>()

export type AutoSection = 'auto-hub' | 'driver' | 'vehicle' | 'auto-summary'
export const hub: StartStopPair = ['auto-hub', emptySet]
export const driver = (pos: number): StartStopPair => [`auto-driver-${pos}`, emptySet]
export const vehicle = (pos: number): StartStopPair => [`auto-auto-${pos}`, emptySet]
export const summary: StartStopPair = ['auto-plan-type', new Set(['auto-ya-disclaimer'])]

export const makeAutoPagesRecord = (page: AutoSection): StartStopPair => {
    const [, autoPage = '', count = '1' ] = page.match(/(driver|vehicle)-(\d+)/i) || []
    const position = parseInt(count, 10)-1
    console.log({page, autoPage, position})
    switch (autoPage || page) {
        case 'auto-hub':
            return hub
        case 'auto-summary':
            return summary
        case 'driver':
            return driver(position)
        case 'vehicle':
            return vehicle(position)
        default:
            return ['', emptySet]
    }
}
