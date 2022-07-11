
import Portfolio, { InputFieldType } from "@youngalfred/bowtie-sdk";
import { OptionType } from "@youngalfred/bowtie-sdk";
import { AppField } from "src/types";
import { BodyStylesData, MakesData, ModelsData, VinData } from "src/types/auto-service";

const getAutoWith17DigitVin: AsyncRuleMap[string] = (app, _field, [idxOfAuto = 0]) => async (): Promise<void> => {
    const idPrefix = `auto.autos.${idxOfAuto}.`
    const hasVin = app.find(`${idPrefix}hasVinNumber`)?.value === 'yes';

    if (hasVin) {
        const isValidVINLength = app.find(`${idPrefix}vinNumber`)?.value.length === 17

        if (isValidVINLength) {
            await app.fillAutoWithVinData<VinData>(idxOfAuto, {
                // Your result may differ, if your proxy server returns auto data
                // in another format. The return value of the mapper MUST look the same, though.
                resultsMapper: ({ year, make, model, bodyStyle }) => ({ year, make, model, bodyType: bodyStyle }),
                headers: {
                    // ... any request headers you wish to send
                }
            })
        }
    }
}

type OverridableAutoField = 'make'|'model'|'bodyType'
const sdkAutoFns: Record<OverridableAutoField, 'updateAutoBodyTypeOptions'|'updateAutoMakeOptions'|'updateAutoModelOptions'> = {
    make: 'updateAutoMakeOptions',
    model: 'updateAutoModelOptions',
    bodyType: 'updateAutoBodyTypeOptions',
}

const overrideOptionsFor = <T>(
    key: OverridableAutoField,
    resultsMapper: (data: T) => OptionType[]
): AsyncRuleMap[string] =>
    (app, field, [idxOfAuto = 0]) => async (): Promise<void> => {
        const idPrefix = `auto.autos.${idxOfAuto}.`
        const shallOverrideOptions = (
            field.kind === "select"
            && !!field.value
            // only override options when not using the sister service: vin prefill,
            // which causes the options to be length 1
            && field.options.length !== 1
        )

        if (shallOverrideOptions) {
            try {
                await app[sdkAutoFns[key]]?.(idxOfAuto, {
                    resultsMapper,
                    headers: {
                        // any request headers you might want to send to your proxy server
                    }
                })
            } catch (err: any) {
                const wasCarAlreadyRetrievedByVin = (err?.code || '') === 'ABORT_AUTO_OPTIONS_OVERRIDE'

                if (wasCarAlreadyRetrievedByVin) {
                    console.warn(err.message)
                    // The service isn't down (no need to convert to text fields),
                    // we simply prioritized using the vin service's results 
                    return
                }

                // Keep in order of progression (can't fill out model without make first)
                const fieldsToConvert: OverridableAutoField[] = ['make', 'model', 'bodyType']
                const idxOfCurrent = fieldsToConvert.indexOf(key)
                if (idxOfCurrent < 0) {
                    throw new Error("Ensure the auto field ids align with your expectations.")
                }
                fieldsToConvert.slice(idxOfCurrent).forEach(keyOfFailure => {
                    // vin service is down,
                    // but customers still need the ability
                    // to enter their car's data:
                    app._overwriteField(`${idPrefix}${keyOfFailure}`, { kind: 'text' })
                })
            }
        }
    }

type AsyncRuleMap = Record<
    string,
    (
        app: Portfolio,
        field: InputFieldType,
        replaced: number[]
    ) => AppField["applySideEffect"]
>

const fieldsWithSideEffects: AsyncRuleMap = {
    'auto.autos.n.vinNumber': getAutoWith17DigitVin,
    'auto.autos.n.year': overrideOptionsFor<MakesData>('make',
        ({ makes }) => makes.map(({ description }) => ({ name: description, label: description }))
    ),
    'auto.autos.n.make': overrideOptionsFor<ModelsData>('model',
        ({ models }) => models.map(({ model }) => ({ name: model, label: model }))
    ),
    'auto.autos.n.model': overrideOptionsFor<BodyStylesData>('bodyType',
        ({ bodyStyles }) => bodyStyles.map(({ description }) => ({ name: description, label: description }))
    ),
}

const idRgx = /\.(\d+)\./
export const getSideEffectFor = (state: Portfolio, field: InputFieldType) => {
    const standardId = field.id.replace(idRgx, '.n.')
    const [, ...targets] = field.id.match(idRgx) || []
    const parsedTargets = targets.map(x => parseInt(x || '0', 10))
    return fieldsWithSideEffects[standardId]?.(state, field, parsedTargets) || undefined
}