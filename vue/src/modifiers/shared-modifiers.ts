import type { Node } from '@/types'

export type BaseConverter<T extends Node | Node[], U extends Node | Node[]> = (
  node: T,
  ...args: any[]
) => U
export type InterrimConverter<T> = (converter?: T) => T
export const makeDefaultConverter =
  <T extends Node | Node[]>(): BaseConverter<T, T> =>
  (input, ...args: any[]) =>
    input

export const toCardGroup =
  <T extends Node | Node[]>(converter = makeDefaultConverter<T>()) =>
  (node: T): T =>
    converter({
      ...node,
      renderer: 'card',
    })

type ModifierRecord<T extends Node, U extends Node | Node[]> = Record<string, BaseConverter<T, U>>
export const assignModifierToFieldsWithPrefix =
  <T extends Node, U extends Node | Node[]>(idPrefix: string, modifier: BaseConverter<T, U>) =>
  (...fieldnames: string[]): ModifierRecord<T, U> =>
    fieldnames.reduce(
      (acc, next) => ({
        ...acc,
        [`${idPrefix}${next}`]: modifier,
      }),
      {},
    )

type PrefixFieldnamesPair = [string, string[]]
export const assignModifierToFieldsByPrefixes =
  <T extends Node, U extends Node | Node[]>(modifier: BaseConverter<T, U>) =>
  (...pairs: PrefixFieldnamesPair[]): ModifierRecord<T, U> =>
    pairs.reduce(
      (acc, [prefix, fieldnames]) => ({
        ...acc,
        ...assignModifierToFieldsWithPrefix(prefix, modifier)(...fieldnames),
      }),
      {},
    )
