export type ExtMaterial = {
    name: string
    material: string
    image: string
    code: string
}
export type ExtNewMaterial = ExtMaterial & {
    newName: string
}
export type Profile = {
    name: string
    type: ProfileType
    code: string
    brush: string
}
export type NewProfile = Profile & {
    newName: string
}

export type Edge = {
    name: string
    dsp: string
    code: string
}
export type NewEdge = Edge & {
    newName: string
}

export type Zaglushka = {
    name: string
    dsp: string
    code: string
}
export type NewZaglushka = Zaglushka & {
    newName: string
}

export enum ProfileType {
    STANDART = 'STANDART',
    BAVARIA = 'BAVARIA'
}
