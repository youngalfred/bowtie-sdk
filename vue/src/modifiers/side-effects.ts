import type { GenericField, InputNode } from '@/types'

type AsyncRuleMap = Record<
    string,
    (
        field: InputNode,
        state: any,
        replaced: number[]
    ) => GenericField['sideEffect']
>

const getAutoWith17DigitVin: AsyncRuleMap[string] = (field, store, [idxOfAuto = 0]) => async (): Promise<void> => {
    await store.fetchAndFillAutoByVin(idxOfAuto, field)
}

const overrideOptionsFor = (
    key: 'make'|'model'|'bodyType'
): AsyncRuleMap[string] =>
    (field, store, [idxOfAuto = 0]) => async (isInitialRender) => {
        const idPrefix = `auto.autos.${idxOfAuto}.`
        const hasVin = store.app.find(`${idPrefix}hasVinNumber`)?.value === 'yes';
        const isValidVINLength = store.app.find(`${idPrefix}vinNumber`)?.value.length === 17

        // On iniital load/refresh, don't overwrite the auto as returned
        // by the vin service
        if (!isInitialRender || !(hasVin && isValidVINLength)) {
            await store.overrideAutoOptionsFor(key, field, idxOfAuto)
        }
    }

const asyncRules: AsyncRuleMap = {
    'auto.autos.n.vinNumber': getAutoWith17DigitVin,
    'auto.autos.n.year': overrideOptionsFor('make'),
    'auto.autos.n.make': overrideOptionsFor('model'),
    'auto.autos.n.model': overrideOptionsFor('bodyType'),
}

const idRgx = /\.(\d+)\./
export const getSideEffectFor = (node: InputNode, store: any): GenericField['sideEffect'] => {
    const standardId = node.id.replace(idRgx, '.n.')
    const [, ...targets] = node.id.match(idRgx) || []
    const parsedTargets = targets.map(x => parseInt(x || '0', 10))
    return asyncRules[standardId]?.(node, store, parsedTargets)
}