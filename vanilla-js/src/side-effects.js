const getAutoWith17DigitVin = (app, _field, [idxOfAuto = 0]) => async () => {
    const idPrefix = `auto.autos.${idxOfAuto}.`
    const hasVin = app.find(`${idPrefix}hasVinNumber`)?.value === 'yes';

    if (hasVin) {
        const isValidVINLength = app.find(`${idPrefix}vinNumber`)?.value.length === 17

        if (isValidVINLength) {
            try {
                await app.fillAutoWithVinData(idxOfAuto, {
                    // Your result may differ, assuming your proxy server returns auto data
                    // in another format. The return value of the mapper MUST look the same, though.
                    resultsMapper: ({ year, make, model, bodyStyle }) => ({ year, make, model, bodyType: bodyStyle }),
                    headers: {
                        // ... any request headers you wish to send
                    }
                })
            } catch (err) {
                console.error(err)
            } finally {
                return true
            }
        }
    }

    return false
}

const sdkAutoFns = {
    make: 'updateAutoMakeOptions',
    model: 'updateAutoModelOptions',
    bodyType: 'updateAutoBodyTypeOptions',
}

const overrideOptionsFor = (
    key,
    resultsMapper
) =>
    (app, field, [idxOfAuto = 0]) => async () => {
        const idPrefix = `auto.autos.${idxOfAuto}.`
        const shallOverrideOptions = (
            // When the year entered is earlier than 1981,
            // the car identity fields (make, model, body type)
            // become text inputs because the national vin service
            // does not have record of vehicles older than 1981. 
            field.kind === "select"
            // For example, ensure year has been
            // selected before trying to retrieve
            // makes by year
            && !!field.value
            // only override options when not using the sister service: vin prefill,
            // which causes the options to be length 1
            && field.options.length !== 1
        )

        if (!shallOverrideOptions) {
            return false
        }

        try {
            await app[sdkAutoFns[key]]?.(idxOfAuto, {
                resultsMapper,
                headers: {
                    // any request headers you might want to send to your proxy server
                }
            })
            return true
        } catch (err) {
            console.log({err})
            const wasCarAlreadyRetrievedByVin = (err?.code || '') === 'ABORT_AUTO_OPTIONS_OVERRIDE'

            if (wasCarAlreadyRetrievedByVin) {
                console.warn(err.message)
                // The service isn't down (no need to convert to text fields),
                // we simply prioritized using the vin service's results
                return false
            }

            // Keep in order of progression (can't fill out model without make first)
            const fieldsToConvert = ['make', 'model', 'bodyType']
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
            return true
        }
    }

const fieldsWithSideEffects = {
    'auto.autos.n.vinNumber': getAutoWith17DigitVin,
    'auto.autos.n.year': overrideOptionsFor('make',
        ({ makes }) => makes.map(({ description }) => ({ name: description, label: description }))
    ),
    'auto.autos.n.make': overrideOptionsFor('model',
        ({ models }) => models.map(({ model }) => ({ name: model, label: model }))
    ),
    'auto.autos.n.model': overrideOptionsFor('bodyType',
        ({ bodyStyles }) => bodyStyles.map(({ description }) => ({ name: description, label: description }))
    ),
}

const idRgx = /\.(\d+)\./
const getSideEffectFor = (portfolio, field) => {
    const standardId = field.id.replace(idRgx, '.n.')
    const [, ...targets] = field.id.match(idRgx) || []
    const parsedTargets = targets.map(x => parseInt(x || '0', 10))
    return fieldsWithSideEffects[standardId]?.(portfolio, field, parsedTargets) || undefined
}

module.exports = getSideEffectFor;
