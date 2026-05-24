import { MODULEPROJ_MATERIAL_CORRESPOND_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleMaterialCorrespondTableSchema } from "../../../types/schemas/moduleSchemas"
import { getDataBaseModuleService } from "../../options"
import express from "express";
import { hasPermission } from "../users";
import { API_KEYS, MyRequest } from "../../../types/server";
import { PERMISSION, RESOURCE } from "../../../types/user";
import { accessDenied } from "../../functions/database";
import messages from "../../messages";
import { OmitId } from "../../../types/materials";
import { getApiKey } from "../settings";

const router = express.Router();
export default router

export async function getModuleMaterialCorrespond() {
    const service = getDataBaseModuleService<ModuleMaterialCorrespondTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.MATERIAL_CORRESPOND, ["id", "matIndex", "material1C", "materialId"], {})
}

export async function addModuleMaterialCorrespond(data: OmitId<ModuleMaterialCorrespondTableSchema>) {
    const service = getDataBaseModuleService<ModuleMaterialCorrespondTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.MATERIAL_CORRESPOND, { ...data })
}

export async function removeModuleMaterialCorrespond(id: number) {
    const service = getDataBaseModuleService<ModuleMaterialCorrespondTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.MATERIAL_CORRESPOND, { id })
}

export async function updateModuleMaterialCorrespond(data: ModuleMaterialCorrespondTableSchema) {
    const service = getDataBaseModuleService<ModuleMaterialCorrespondTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.MATERIAL_CORRESPOND, { id: data.id }, data)
}


router.get(MODULEPROJ_MATERIAL_CORRESPOND_ROUTE, async (req, res) => {
    if ((req as MyRequest).apiKey !== await getApiKey(API_KEYS.MODULEPROJECT)) {
        if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.READ]))) return accessDenied(res)
    }
    const result = await getModuleMaterialCorrespond()
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULEPROJ_MATERIAL_CORRESPOND_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { matIndex, material1C, materialId } = req.body as ModuleMaterialCorrespondTableSchema
    const result = await addModuleMaterialCorrespond({ matIndex, material1C, materialId });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULEPROJ_MATERIAL_CORRESPOND_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, matIndex, material1C, materialId} = req.body as ModuleMaterialCorrespondTableSchema
    const result = await updateModuleMaterialCorrespond({ id, matIndex, material1C, materialId });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULEPROJ_MATERIAL_CORRESPOND_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleMaterialCorrespond(id);
  result.message = result.message
  res.status(result.status).json(result)
});

