import { SpecificationItem } from "./enums"
import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from "./materials"
import { PriceListItem, Result, Results, Token, User } from "./server"
import { NewTemplate, Template } from "./templates"
import { SpecificationResult, WardrobeData } from "./wardrobe"
interface IUserAbstractService {
    getUsers: () => Promise<Result<User[]>>
    getTokens: () => Promise<Result<Token[]>>
    addToken: ({ token, username, time, lastActionTime }: Token) => Promise<Result<null>>
    updateToken: (token: string, lastActionTime: number) => Promise<Result<null>>
    deleteToken: (token: string) => Promise<Result<null>>
    clearAllTokens: () => Promise<Result<null>>
    registerUser: (user: User) => Promise<Result<null>>
    deleteUser: (user: User) => Promise<Result<null>>
}
export interface IMaterialService {
    getExtMaterials: () => Promise<Result<ExtMaterial[]>>
    addExtMaterial: ({ }: ExtMaterial) => Promise<Result<null>>
    updateExtMaterial: ({ }: ExtNewMaterial) => Promise<Result<null>>
    deleteExtMaterial: (name: string, base: string) => Promise<Result<null>>
    getProfiles: () => Promise<Result<Profile[]>>
    addProfile: ({ }: Profile) => Promise<Result<null>>
    deleteProfile: (name: string, type: string) => Promise<Result<null>>
    updateProfile: ({ }: NewProfile) => Promise<Result<null>>
}
export interface IMaterialExtService<T> {
    getExtData: () => Promise<Result<T[]>>
    addExtData: ({ }: T) => Promise<Result<null>>
    deleteExtData: (name: string) => Promise<Result<null>>
    updateExtData: ({ }: T & {newName: string}) => Promise<Result<null>>
}
interface ITemplateAbstractService {
    getTemplates: (table: string) => Promise<Result<Template[]>>
    addTemplate: (table: string, { }: Template) => Promise<Result<null>>
    deleteTemplate: (table: string, name: string) => Promise<Result<null>>
    updateTemplate: (table: string, { }: NewTemplate) => Promise<Result<null>>
}
interface IPriceAbstractService {
    getPriceList: () => Promise<Result<PriceListItem[]>>
    updatePriceList: (item: PriceListItem) => Promise<Result<null>>
}
export interface ISpecificationService {
    getSpecList: (data: WardrobeData, coefList: Map<SpecificationItem, number>) => Promise<Result<SpecificationResult>>
}
export interface IMaterialServiceProvider extends IMaterialService {
    dbFile: string
}
export interface IMaterialExtServiceProvider<T> {
    service: IMaterialExtService<T>
    dbFile: string
}
export interface ITemplateServiceProvider extends ITemplateAbstractService {
    dbFile: string
}
export interface ITemplateService extends ITemplateAbstractService {
    provider: ITemplateServiceProvider
}
export interface IUserServiceProvider extends IUserAbstractService {
    dbFile: string
}
export interface IUserService extends IUserAbstractService {
    provider: IUserServiceProvider
}

export interface IPriceServiceProvider extends IPriceAbstractService {
    dbFile: string
}
export interface IPriceService extends IPriceAbstractService {
    provider: IPriceServiceProvider
}