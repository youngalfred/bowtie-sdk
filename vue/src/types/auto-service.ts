import type { OptionType } from '@youngalfred/bowtie-sdk'

export type VinData = {
    year: number
    make: string
    model: string
    bodyStyle: string
    engineSize: string
}

export type MakesData = {
    makes: {
        make: VinData['make']
        description: string
    }[]
}

export type ModelsData = {
    models: {
        model: string
    }[]
}

export type BodyStylesData = {
    bodyStyles: {
        bodyStyle: string
        description: string
    }[]
}

export type ResultMapper = (data: any) => OptionType[]

export type SdkAutoFn = (idxOfAuto: number, options: {
    resultsMapper: ResultMapper
    headers?: Record<string, any>
}) => Promise<void>