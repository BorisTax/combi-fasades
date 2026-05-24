import { MODULEPROJ_CORRESPOND_ROUTE, MODULEPROJ_MODULES_ROUTE } from "../../../types/routes";
import { MODULE_TABLE_NAMES, ModuleCorrespondTableSchema, ModuleGroupsTableSchema, ModuleModulesTableSchema, ModuleSeriesTableSchema } from "../../../types/schemas/moduleSchemas"
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

export async function getModulesBySerie(serieId: number | undefined) {
    const res = (await getModules())
    const modules = res.data.filter(m => m.serieId === serieId)
    return {...res, data: modules}
}

export async function getModules() {
    const service = getDataBaseModuleService<ModuleModulesTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.MODULES, ["id", "name", "serieId", "shortName", "sortIndex"], {})
}

export async function addModule(data: OmitId<ModuleModulesTableSchema>) {
    const service = getDataBaseModuleService<ModuleGroupsTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.MODULES, { ...data })
}

export async function removeModule(id: number) {
    const service = getDataBaseModuleService<ModuleModulesTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.MODULES, { id })
}

export async function updateModule(data: ModuleModulesTableSchema) {
    const service = getDataBaseModuleService<ModuleModulesTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.MODULES, { id: data.id }, data)
}

export async function getModuleCorrespondanceBySerie(serieId: number | undefined) {
    const res = (await getModuleCorrespondance())
    const modules = res.data.filter(m => m.serieId === serieId || !serieId)
    return {...res, data: modules}}

export async function getModuleCorrespondance() {
    const service = getDataBaseModuleService<ModuleCorrespondTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.CORRESPOND, ["id", "moduleId","code1C","name1C","serieId", "orderName"], {})
}

export async function addModuleCorrespondance(data: OmitId<ModuleCorrespondTableSchema>) {
    const service = getDataBaseModuleService<ModuleCorrespondTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.CORRESPOND, { ...data })
}

export async function removeModuleCorrespondance(id: number) {
    const service = getDataBaseModuleService<ModuleCorrespondTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.CORRESPOND, { id })
}

export async function updateModuleCorrespondance(data: ModuleCorrespondTableSchema) {
    const service = getDataBaseModuleService<ModuleModulesTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.CORRESPOND, { id: data.id }, data)
}


router.get(MODULEPROJ_MODULES_ROUTE, async (req, res) => {
    if ((req as MyRequest).apiKey !== await getApiKey(API_KEYS.MODULEPROJECT)) {
        if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.READ]))) return accessDenied(res)
    }
    const { serieId } = req.query
    const result = await getModulesBySerie(+(serieId || 0));
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULEPROJ_MODULES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, serieId, shortName, sortIndex } = req.body as ModuleModulesTableSchema
    const result = await addModule({ name,serieId,shortName,sortIndex });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULEPROJ_MODULES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name, serieId, shortName, sortIndex } = req.body as ModuleModulesTableSchema
    const result = await updateModule({ id, name, serieId, shortName, sortIndex });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULEPROJ_MODULES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModule(id);
  result.message = result.message
  res.status(result.status).json(result)
});


router.get(MODULEPROJ_CORRESPOND_ROUTE, async (req, res) => {
    if ((req as MyRequest).apiKey !== await getApiKey(API_KEYS.MODULEPROJECT)) {
        if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.READ]))) return accessDenied(res)
    }
    const { serieId } = req.query
    const result = await getModuleCorrespondanceBySerie(+(serieId || 0));
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULEPROJ_CORRESPOND_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { serieId, code1C, moduleId, name1C, orderName } = req.body as ModuleCorrespondTableSchema
    const result = await addModuleCorrespondance({ code1C,moduleId,name1C,orderName,serieId });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULEPROJ_CORRESPOND_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, serieId, code1C, moduleId, name1C, orderName } = req.body as ModuleCorrespondTableSchema
  const result = await updateModuleCorrespondance({id, code1C,moduleId,name1C,orderName,serieId});
  result.message = (result.success && messages.DATA_UPDATED) || result.message
  res.status(result.status).json(result)
});

router.delete(MODULEPROJ_CORRESPOND_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleCorrespondance(id);
  result.message = result.message
  res.status(result.status).json(result)
});