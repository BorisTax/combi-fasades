import { atom } from "jotai";
import { Profile, ProfileType } from "../../types/materials";
import { FetchResult, fetchData, fetchGetData } from "../../functions/fetch";
import { userAtom } from "../users";
import { TableFields } from "../../types/server";
import { AtomCallbackResult } from "../../types/atoms";
import messages from "../../server/messages";
const initProfile: Profile = { type: ProfileType.STANDART, name: "", brush: "", code: "" }
export const profileListAtom = atom<Profile[]>([initProfile])
export const activeProfileIndexAtom = atom(0)

export const loadProfileListAtom = atom(null, async (get, set) => {
    try {
        const result: FetchResult<[] | string> = await fetchGetData('api/materials/profile')
        if(result.success) set(profileListAtom, result.data as Profile[]);
    } catch (e) { console.error(e) }
})

export const deleteProfileAtom = atom(null, async (get, set, profile: Profile) => {
    const user = get(userAtom)
    try{
        const result = await fetchData("api/materials/profile", "DELETE", JSON.stringify({ name: profile.name, type: profile.type, token: user.token }))
        await set(loadProfileListAtom)
        return { success: result.success as boolean, message: result.message as string }
    }catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const addProfileAtom = atom(null, async (get, set, profile: Profile) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: profile.name,
        [TableFields.TYPE]: profile.type,
        [TableFields.CODE]: profile.code,
        [TableFields.BRUSH]: profile.brush,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/profile", "POST", JSON.stringify(data))
        await set(loadProfileListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e)
        return { success: false, message: messages.QUERY_ERROR }
     }
})

export const updateProfileAtom = atom(null, async (get, set, { name, type, newCode, newName, newBrush }) => {
    const user = get(userAtom)
    const data = {
        [TableFields.NAME]: name,
        [TableFields.NEWNAME]: newName,
        [TableFields.TYPE]: type,
        [TableFields.CODE]: newCode,
        [TableFields.BRUSH]: newBrush,
        [TableFields.TOKEN]: user.token
    }
    try {
        const result = await fetchData("api/materials/profile", "PUT", JSON.stringify(data))
        await set(loadProfileListAtom)
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) { 
        console.error(e) 
        return { success: false, message: messages.QUERY_ERROR }
    }
})