// import type { PortfolioStore } from "@/store/portfolio";
import type { InputNode } from "@/types";
import { getSideEffectFor } from "./side-effects";

type BaseConverter = (field: InputNode, store: any) => InputNode
type InterrimConverter = (converter?: BaseConverter) => BaseConverter
const defaultConverter: BaseConverter = (input) => input

const toFieldWithSideEffects: InterrimConverter = (converter = defaultConverter) => (node, store) => converter({
    ...node,
    renderer: 'async-field',
    sideEffect: getSideEffectFor(node, store),
}, store)

const modifierMap: Record<string, BaseConverter> = {
    'house-type': toFieldWithSideEffects(),
}

export const modifyField = (node: InputNode, store: any) => {
    const converter = modifierMap[node.id]
    return converter?.(node, store) || node
}

export default modifyField