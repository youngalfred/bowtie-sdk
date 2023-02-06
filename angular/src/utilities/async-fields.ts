import Portfolio, { InputFieldType } from '@youngalfred/bowtie-sdk'
import { OptionType } from '@youngalfred/bowtie-sdk'
import { InputNode } from 'src/types'
import { BodyStylesData, MakesData, ModelsData, VinData } from 'src/types/auto-service'

const getAutoWith17DigitVin: AsyncRuleMap[string] =
  (app, _field, [idxOfAuto = 0]) =>
  async (): Promise<void> => {
    const idPrefix = `auto.autos.${idxOfAuto}.`
    const hasVin = app.find(`${idPrefix}hasVinNumber`)?.value === 'yes'

    if (hasVin) {
      const isValidVINLength = app.find(`${idPrefix}vinNumber`)?.value.length === 17

      if (isValidVINLength) {
        await app.fillAutoWithVinData<VinData>(idxOfAuto, {
          // If your proxy server returns auto data in another format OR
          // from a source besides the bowtie api, your result mapper will
          // likely look different. Regardless, the return value of the mapper MUST
          // be an object containing a year, make, model, and bodyType.
          resultsMapper: ({ year, make, model, bodyStyle }) => ({
            year,
            make,
            model,
            bodyType: bodyStyle,
          }),
          // ... any request headers you wish to send
          headers: {
            // 'x-session-id': ...,
          },
        })
      }
    }
  }

type OverridableAutoField = 'make' | 'model' | 'bodyType'
const sdkAutoFns: Record<
  OverridableAutoField,
  'updateAutoBodyTypeOptions' | 'updateAutoMakeOptions' | 'updateAutoModelOptions'
> = {
  make: 'updateAutoMakeOptions',
  model: 'updateAutoModelOptions',
  bodyType: 'updateAutoBodyTypeOptions',
}

const overrideOptionsFor =
  <T>(key: OverridableAutoField, resultsMapper: (data: T) => OptionType[]): AsyncRuleMap[string] =>
  (app, field, [idxOfAuto = 0]) =>
  async (): Promise<void> => {
    const idPrefix = `auto.autos.${idxOfAuto}.`
    const shallOverrideOptions =
      // When the year entered is earlier than 1981,
      // the car identity fields (make, model, body type)
      // become text inputs because the national vin service
      // does not have record of vehicles older than 1981.
      field.kind === 'select' &&
      // For example, ensure year has been
      // selected before trying to retrieve
      // makes by year
      !!field.value &&
      // only override options when not using the sister service: vin prefill,
      // which causes the options to be length 1
      field.options.length !== 1

    if (shallOverrideOptions) {
      try {
        await app[sdkAutoFns[key]]?.(idxOfAuto, {
          resultsMapper,
          // any request headers you might want to send to your proxy server
          headers: {
            // 'x-session-id': ...,
          },
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
          throw new Error('Ensure the auto field ids align with your expectations.')
        }
        fieldsToConvert.slice(idxOfCurrent).forEach(keyOfFailure => {
          // the vin service is down, but customers still need the ability
          // to enter their car's data. For that reason, convert the
          // select field to a text input field to allow customers to continue.
          app._overwriteField(`${idPrefix}${keyOfFailure}`, { kind: 'text' })
        })
      }
    }
  }

type AsyncRuleMap = Record<
  string,
  (app: Portfolio, field: InputFieldType, replaced: number[]) => InputNode['applySideEffect']
>

const fieldsWithSideEffects: AsyncRuleMap = {
  'auto.autos.n.vinNumber': getAutoWith17DigitVin,

  // If your proxy server returns makes, models, and body types in another format OR
  // from a source besides the bowtie api, your result mappers will
  // likely look different. Regardless, the return value of the mapper MUST
  // be a list of options ({ name: string, label: string }).
  'auto.autos.n.year': overrideOptionsFor<MakesData>('make', ({ makes }) =>
    makes.map(({ description }) => ({ name: description, label: description })),
  ),
  'auto.autos.n.make': overrideOptionsFor<ModelsData>('model', ({ models }) =>
    models.map(({ model }) => ({ name: model, label: model })),
  ),
  'auto.autos.n.model': overrideOptionsFor<BodyStylesData>('bodyType', ({ bodyStyles }) =>
    bodyStyles.map(({ description }) => ({ name: description, label: description })),
  ),
}

const idRgx = /\.(\d+)\./
export const getSideEffectFor = (state: Portfolio, field: InputFieldType) => {
  const standardId = field.id.replace(idRgx, '.n.')
  const [, ...targets] = field.id.match(idRgx) || []
  const parsedTargets = targets.map(x => parseInt(x || '0', 10))
  return fieldsWithSideEffects[standardId]?.(state, field, parsedTargets) || undefined
}
