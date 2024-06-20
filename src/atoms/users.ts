import { atom, Setter, Getter } from "jotai"
import { jwtDecode } from 'jwt-decode'
import { fetchData, fetchGetData } from "../functions/fetch"
import { Permissions, RESOURCE, UserRole } from "../types/user"
import { loadPriceListAtom } from "./prices"
import { AtomCallbackResult } from "../types/atoms"


export type UserState = {
    name: string
    role: string
    token: string
    permissions: Map<RESOURCE, Permissions>
}
export type ActiveUserState = UserState & {
    time: number
    lastActionTime: number
}
export const userRolesAtom = atom<UserRole[]>([])
export const loadUserRolesAtom = atom(null, async (get,set)=>{
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.read) return
    const result = await fetchGetData(`api/users/roles?token=${token}`)
    if(result.success){
        set(userRolesAtom, result.data as UserRole[])
    }
})
export const allUsersAtom = atom<UserState[]>([])
export const activeUsersAtom = atom<ActiveUserState[]>([])
export const loadUsersAtom = atom(null, async (get,set)=>{
    const { token, permissions } = get(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    if (!perm?.read) return
    const result = await fetchGetData(`api/users/users?token=${token}`)
    if(result.success){
        set(allUsersAtom, result.data as UserState[])
    }
})
export const loadActiveUsersAtom = atom(null, async (get, set) => {
    const { token, role,permissions } = get(userAtom)
    if (!permissions.get(RESOURCE.USERS)?.read) return
    const result = await fetchGetData(`api/users/active?token=${token}`)
    if(result.success){
        set(activeUsersAtom, result.data as ActiveUserState[])
    }
})

export const userAtom = atom<UserState>({ name: "", role: "", token: "", permissions: getInitialPermissions() })

export const verifyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const { token } = get(userAtom)
        const result = await fetchGetData(`api/users/verify?token=${token}`)
        if (!result.success) {
            set(userAtom, { name: "", role: "", token: "", permissions: getInitialPermissions() })
            return
        }
})
export const standbyUserAtom = atom(null, async (get: Getter, set: Setter) => {
    const { token } = get(userAtom)
    const result = await fetchGetData(`api/users/standby?token=${token}`)
})
export const setUserAtom = atom(null, async (get: Getter, set: Setter, token: string, verify = false) => {
    if (verify) {
        const result = await fetchGetData(`api/users/verify?token=${token}`)
        if(!result.success){
            set(userAtom, { name: "", role: "", token: "", permissions: getInitialPermissions()  })
            return
        }
    }
    let storeUser: UserState
    let perm: Map<RESOURCE, Permissions> = new Map()
    try {
        const { name, role, permissions } = jwtDecode(token) as UserState
        storeUser = { name, role, token, permissions }
        perm = new Map(permissions)
    } catch (e) {
        storeUser = { name: "", role: "", token: "", permissions: getInitialPermissions()  }
    }
    localStorage.setItem('token', storeUser.token)
    const p = perm.get(RESOURCE.PRICES)
    set(userAtom, storeUser)
    if (p?.read) set(loadPriceListAtom)
})
export const logoutAtom = atom(null, async (get: Getter, set: Setter) => {
    localStorage.removeItem("token")
    const user = get(userAtom)
    fetchData('api/users/logout', "POST", JSON.stringify({ token: user.token }))
    set(userAtom, getInitialUser())
})
export const logoutUserAtom = atom(null, async (get: Getter, set: Setter, usertoken: string) => {
    const user = get(userAtom)
    await fetchData('api/users/logoutUser', "POST", JSON.stringify({ token: user.token, usertoken }))
    set(loadActiveUsersAtom)
})

export const createUserAtom = atom(null, async (get: Getter, set: Setter, { name, password, role }: { name: string, password: string, role: UserRole }, callback: AtomCallbackResult) => {
    const {token} = get(userAtom)
    const result = await fetchData('api/users/add', "POST", JSON.stringify({ name, password, role, token }))
    if (result.success) set(loadUsersAtom)
    callback({ success: result.success as boolean, message: result.message  as string })
})
export const deleteUserAtom = atom(null, async (get: Getter, set: Setter, { name }: { name: string}, callback: AtomCallbackResult) => {
    const {token} = get(userAtom)
    const result = await fetchData('api/users/delete', "DELETE", JSON.stringify({ name, token }))
    if (result.success) {
        set(loadUsersAtom)
        set(loadActiveUsersAtom)
    }
    callback({ success: result.success as boolean, message: result.message  as string })
})
export function getInitialUser(): UserState {
    const token = localStorage.getItem("token") || ""
    let storeUser: UserState
    try {
        storeUser = jwtDecode(token) as UserState
    } catch (e) {
        storeUser = {
            name: "",
            role: "",
            token,
            permissions: getInitialPermissions()
        }
    }
    const user = {
        name: storeUser.name,
        role: storeUser.role,
        token,
        permissions: new Map(storeUser.permissions)
    }
    return user
}

export function getInitialPermissions(): Map<RESOURCE, Permissions> {
    const m = new Map<RESOURCE, Permissions>()
    Object.keys(RESOURCE).forEach(k => m.set(k as RESOURCE, { create: false, update: false, read: false, remove: false }))
    return m
}