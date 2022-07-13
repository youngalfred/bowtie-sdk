import type { Node } from "@/types"

export type BaseConverter<T extends Node, U extends Node> = (node: T, ...args: any[]) => U
export type InterrimConverter<T> = (converter?: T) => T
export const makeDefaultConverter = <T extends Node>(): BaseConverter<T, T> => ((input, ...args: any[]) => input)

export const toCardGroup = <T extends Node>(converter = makeDefaultConverter<T>()) => (node: T): T => converter({
    ...node,
    renderer: 'card'
})