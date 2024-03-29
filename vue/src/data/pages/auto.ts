import type { StartStopPair } from '.'

export type AutoSection =
  | 'auto-hub'
  | 'driver'
  | 'vehicle'
  | 'auto-summary'
  | `vehicle-${number}`
  | `driver-${number}`
export const hub: StartStopPair = ['auto-hub', 'auto-hub']
export const driver = (pos: number): StartStopPair => [
  `driver-factory > auto-driver-${pos} > auto-driver-${pos}-name`,
  `auto-driver-${pos}-currentlyInsured`,
]
export const vehicle = (pos: number): StartStopPair => [
  `auto-factory > auto-auto-${pos} > auto-auto-${pos}-car-identity`,
  `auto-auto-${pos}-discountprogram`,
]
export const summary: StartStopPair = ['auto-plan-type', 'auto-ya-disclaimer']

export const makeAutoPagesRecord = (page: AutoSection): StartStopPair => {
  const [, autoPage = '', count = '1'] = page.match(/(driver|vehicle)-(\d+)/i) || []
  const position = parseInt(count, 10) - 1 // back to zero-based indeces

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
      return ['', '']
  }
}
