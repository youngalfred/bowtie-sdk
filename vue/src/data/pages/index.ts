
import type { SDKFieldGroup } from "@/types"
import type { FieldType } from "@youngalfred/bowtie-sdk"
import type Portfolio from "@youngalfred/bowtie-sdk"
import { makeAutoPagesRecord, type AutoSection } from "./auto"
import { homePagesRecord, type HomeSection } from "./home"

export type StartStopPair = [string, Set<string>]
export const getQuestionsForPage = (view: Portfolio['view'], page: HomeSection | AutoSection) => {
    const [startPath, stopIdSet] = (
        homePagesRecord[page as HomeSection]
        || makeAutoPagesRecord(page as AutoSection)
    )
    const startIds = startPath.split(' > ')
    const remainingFgs = startIds.reduce((acc, nextId, idx) => {
        const startIdx = acc.findIndex(fg => fg.id === nextId)
        if (startIdx === -1) {
            throw new Error(`Cannot find fieldgroup with id ${nextId}`)
        }
        
        return startIds.length && idx !== startIds.length-1
            ? (acc[startIdx] as SDKFieldGroup).children
            : acc.slice(startIdx)
    }, view as (SDKFieldGroup|FieldType)[])

    const endIdx = remainingFgs.findIndex(fg => stopIdSet.has(fg.id))

    return remainingFgs.slice(0, ...endIdx === -1 ? [] : [endIdx + 1])
}