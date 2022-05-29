
import type { SDKFieldGroup } from "@/types"
import type Portfolio from "@youngalfred/bowtie-sdk"
import { makeAutoPagesRecord, type AutoSection } from "./auto"
import { homePagesRecord, type HomeSection } from "./home"

export type StartStopPair = [string, Set<string>]
export const getQuestionsForPage = (view: Portfolio['view'], page: HomeSection | AutoSection) => {
    const [startId, stopIdSet] = (
        homePagesRecord[page as HomeSection]
        || makeAutoPagesRecord(page as AutoSection)
    )

    const [, factoryPage] = page.match(/(driver|vehicle)-\d+/) || []
    if (!!factoryPage) {
        const rgx = new RegExp(`^${factoryPage === 'vehicle' ? 'auto' : factoryPage}-factory$`, 'i')
        const { children = [] } = (
            view.find(({ id }) => rgx.test(id))?.children.find(fg => startId === fg.id) as SDKFieldGroup
         ) || {}

        console.log({children})
        return children
    }
    
    const startIdx = view.findIndex(fg => fg.id === startId)
    if (startIdx === -1) {
        throw new Error(`Cannot find fieldgroup with id ${startId}`)
    }

    const remainingFgs = view.slice(startIdx+1)

    const endIdx = remainingFgs.findIndex(fg => stopIdSet.has(fg.id))
    return view.slice(startIdx, startIdx + 2 + endIdx)
}