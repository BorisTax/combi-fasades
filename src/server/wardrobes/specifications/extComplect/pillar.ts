import { SpecificationItem } from "../../../../types/specification";
import { WardrobeData, SpecificationResult, DETAIL_NAME, Detail } from "../../../../types/wardrobe";
import { getDetails, getEdge2, getEdge05, getGlue, getConfirmat, getMinifix } from "../corpus";
import { getDSP } from "../functions";


export async function getPillarSpecification(data: WardrobeData): Promise<SpecificationResult[]> {
    const result: SpecificationResult[] = []
    const details = (await getDetails(data.wardKind, data.width, data.height, data.depth))
    const shelf = details.find(d => d.name === DETAIL_NAME.PILLAR)
    if (!shelf) return result
    const shelves: Detail[] = [
        { name: DETAIL_NAME.PILLAR, count: 1, length: shelf.length, width: shelf.width },
    ]
    const edge2 = await getEdge2(data, shelves)
    const edge05 = await getEdge05(data, shelves)
    const conf = await getConfirmat(data, shelves)
    const minifix = await getMinifix(data, details)
    result.push([SpecificationItem.DSP, await getDSP(data, shelves)])
    result.push([SpecificationItem.Kromka05, edge05])
    result.push([SpecificationItem.Glue, await getGlue(data, edge2.data.amount, edge05.data.amount)])
    result.push([SpecificationItem.Confirmat, conf])
    result.push([SpecificationItem.ZagConfirmat, { data: { amount: conf.data.amount } }])
    result.push([SpecificationItem.Minifix, minifix])
    result.push([SpecificationItem.ZagMinifix, { data: { amount: minifix.data.amount } }])
    //const karton = 2
    //result.push([SpecificationItem.Karton, { data: { amount: karton } }])
    //result.push([SpecificationItem.Skotch, { data: { amount: karton * 20 } }])
    //result.push([SpecificationItem.ConfKluch, { data: { amount: 1 } }])
    return result
}


