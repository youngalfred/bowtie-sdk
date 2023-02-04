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
