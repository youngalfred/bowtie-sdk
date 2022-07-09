import Portfolio, { InputFieldType } from "@youngalfred/bowtie-sdk";
import { AppField } from "src/types";

type UpdateFunction = (value: string) => void;

export const onChangeJson = (e: Event, existingValue: Record<string,string>, changeHandler: UpdateFunction) => {
    const { value = "", options } = e.target as HTMLSelectElement;
    const label = Array.from(options).find((o: HTMLOptionElement) => o.selected)?.label;
    if (!label) {
        throw new Error("Developer error. Unable to find label of selected option.");
    }
    changeHandler(JSON.stringify({...existingValue, [label]: value }));
};

export const onChange = (e: Event, changeHandler: UpdateFunction) => {
    const { value = "" } = e.target as HTMLInputElement | HTMLSelectElement;
    changeHandler(value);
};

export const onCheck = (e: Event, changeHandler: UpdateFunction) => {
    const { checked = false } = e.target as HTMLInputElement;
    changeHandler(checked ? "1" : "");
};

const getAutoWith17DigitVin: AsyncRuleMap[string] = (app, _field, [idxOfAuto = 0]) => async (): Promise<void> => {
    const idPrefix = `auto.autos.${idxOfAuto}.`
    const hasVin = app.find(`${idPrefix}hasVinNumber`)?.value === 'yes';

    if (hasVin) {
        const isValidVINLength = app.find(`${idPrefix}vinNumber`)?.value.length === 17

        if (isValidVINLength) {
            // @ts-ignore
            await app.fillAutoWithVinData(idxOfAuto, {
                // ... any request headers you wish to send
            })
        }
    }
}

type OverridableAutoField = 'make'|'model'|'bodyType'
const overrideOptionsFor = (
    key: OverridableAutoField,
    sdkAutoFn: "updateAutoMakeOptions"|
    "updateAutoBodyTypeOptions"|
    "updateAutoModelOptions"
): AsyncRuleMap[string] =>
    (app, field, [idxOfAuto = 0]) => async (_isInitialRender): Promise<void> => {
        const idPrefix = `auto.autos.${idxOfAuto}.`
        const shallOverrideOptions = (
            field.kind === "select"
            && !!field.value
            // only override options when not using the sister service: vin prefill,
            // which causes the options to be 1
            && field.options.length !== 1
        )

        if (shallOverrideOptions) {
            try {
                // @ts-ignore
                await app[sdkAutoFn](idxOfAuto)
            } catch (err: any) {
                const wasCarAlreadyRetrievedByVin = (err?.code || '') === 'ABORT_AUTO_OPTIONS_OVERRIDE'

                if (wasCarAlreadyRetrievedByVin) {
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
    ) => AppField["sideEffect"]
>
const fieldsWithSideEffects: AsyncRuleMap = {
    'auto.autos.n.vinNumber': getAutoWith17DigitVin,
    'auto.autos.n.year': overrideOptionsFor('make', "updateAutoMakeOptions"),
    'auto.autos.n.make': overrideOptionsFor('model', "updateAutoModelOptions"),
    'auto.autos.n.model': overrideOptionsFor('bodyType', "updateAutoBodyTypeOptions"),
}

const idRgx = /\.(\d+)\./
export const applySideEffectFor = (state: Portfolio, field: InputFieldType) => {
    const standardId = field.id.replace(idRgx, '.n.')
    const [, ...targets] = field.id.match(idRgx) || []
    const parsedTargets = targets.map(x => parseInt(x || '0', 10))
    return fieldsWithSideEffects[standardId]?.(state, field, parsedTargets) || undefined
}