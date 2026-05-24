import { atom } from "jotai";
import { fetchData, fetchGetData, FetchResult } from "../functions/fetch";
import { ApiKeySchema } from "../types/settings";
import { API_ROUTE, APIKEYS_ROUTE, SETTINGS_ROUTE } from "../types/routes";
import { makeExtMap } from "./storage";
import messages from "../server/messages";
export type AppSettings = {
    showFixIcons: boolean
    minSize: number
}

export function getDefaultSettings(): AppSettings {
    return { showFixIcons: true, minSize: 50 }
}
export function getStoredSettings(): AppSettings {
    const settings = localStorage.getItem("settings")
    if (!settings) return getDefaultSettings()
    try {
        return JSON.parse(settings)
    } catch (e) {
        return getDefaultSettings()
    }
}

export const settingsAtom = atom<AppSettings>(getStoredSettings())

export const setSettingsAtom = atom(null, (get, set, settings: AppSettings) => {
    const newSettings = { ...settings }
    set(settingsAtom, newSettings)
    localStorage.setItem("settings", JSON.stringify(newSettings))
})




export const loadApiKeys =  async () => {
    try {
        const fetchData: FetchResult<ApiKeySchema> = await fetchGetData(`${API_ROUTE}${SETTINGS_ROUTE}${APIKEYS_ROUTE}`)
        const data = fetchData.data
        return makeExtMap(data)
    } catch (e) { 
        console.error(e)
        return new Map()
     }
}

export const addApiKey = async (data: ApiKeySchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${SETTINGS_ROUTE}${APIKEYS_ROUTE}`, "POST", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const updateApiKey = async (data: ApiKeySchema) => {
    try {
        const result = await fetchData(`${API_ROUTE}${SETTINGS_ROUTE}${APIKEYS_ROUTE}`, "PUT", JSON.stringify({ ...data }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}

export const deleteApiKey = async (id: number) => {
    try {
        const result = await fetchData(`${API_ROUTE}${SETTINGS_ROUTE}${APIKEYS_ROUTE}`, "DELETE", JSON.stringify({ id }))
        return { success: result.success as boolean, message: result.message as string }
    } catch (e) {
         console.error(e) 
         return { success: false, message: messages.QUERY_ERROR }
        }
}