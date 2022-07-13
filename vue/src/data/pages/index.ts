
import type { SDKFieldGroup } from '@/types'
import type { FieldType } from '@youngalfred/bowtie-sdk'
import type Portfolio from '@youngalfred/bowtie-sdk'
import { makeAutoPagesRecord, type AutoSection } from './auto'
import { homePagesRecord, type HomeSection } from './home'

export type StartStopPair = [string, string]
export const getQuestionsForPage = (view: Portfolio['view'], page: HomeSection | AutoSection) => {
    const [startPath, stopIds] = (
        homePagesRecord[page as HomeSection]
        || makeAutoPagesRecord(page as AutoSection)
    )

    const startIds = startPath.split(' > ')
    const remainingFgs = startIds.reduce((acc, nextId, idx) => {
        const nextIds = new Set(nextId.split('|'))
        const startIdx = acc.findIndex(fg => nextIds.has(fg.id))
        if (startIdx === -1) {
            throw new Error(`Cannot find fieldgroup with id ${nextId}`)
        }

        return startIds.length && idx !== startIds.length-1
            ? (acc[startIdx] as SDKFieldGroup).children
            : acc.slice(startIdx)
    }, view as (SDKFieldGroup|FieldType)[])

    const stopIdSet = new Set(stopIds.split('|'))
    const endIdx = remainingFgs.findIndex(fg => stopIdSet.has(fg.id))

    return remainingFgs.slice(0, ...endIdx === -1 ? [] : [endIdx + 1])
}