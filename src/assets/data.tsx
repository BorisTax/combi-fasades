import { UserRoles } from "../atoms/users";
import { FasadMaterial } from "../types/enums";

export const colors = {
    [FasadMaterial.DSP]: "#ff7b00",
    [FasadMaterial.FMP]: "#ff00f2",
    [FasadMaterial.MIRROR]: "#00e1ff",
    [FasadMaterial.LACOBEL]: "#ffc400",
    [FasadMaterial.LACOBELGLASS]: "#fffb00",
    [FasadMaterial.SAND]: "#15ff00"
}
export const Materials: Map<string, string> = new Map()
Materials.set("ДСП", FasadMaterial.DSP)
Materials.set("ЗЕРКАЛО", FasadMaterial.MIRROR)
Materials.set("ЛАКОБЕЛЬ", FasadMaterial.LACOBEL)
Materials.set("ЛАКОБЕЛЬ(СТЕКЛО)", FasadMaterial.LACOBELGLASS)
Materials.set("ФМП", FasadMaterial.FMP)
Materials.set("ПЕСКОСТРУЙ", FasadMaterial.SAND)

export const MaterialCaptions: Map<string, string> = new Map()
MaterialCaptions.set(FasadMaterial.DSP, "ДСП")
MaterialCaptions.set(FasadMaterial.MIRROR, "ЗЕРКАЛО")
MaterialCaptions.set(FasadMaterial.LACOBEL, "ЛАКОБЕЛЬ")
MaterialCaptions.set(FasadMaterial.LACOBELGLASS, "ЛАКОБЕЛЬ(СТЕКЛО)")
MaterialCaptions.set(FasadMaterial.FMP, "ФМП")
MaterialCaptions.set(FasadMaterial.SAND, "ПЕСКОСТРУЙ")

export const UserRolesCaptions = {
    [UserRoles.GUEST]: "АНОНИМ",
    [UserRoles.MANAGER]: "МЕНЕДЖЕР",
    [UserRoles.ADMIN]: "АДМИН",
    [UserRoles.SUPERADMIN]: "СУПЕРАДМИН",
}