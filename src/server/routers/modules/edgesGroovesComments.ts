import { MODULEPROJ_COMMENTS_ROUTE,  MODULEPROJ_EDGES_ROUTE, MODULEPROJ_GROOVES_ROUTE  } from "../../../types/routes";
import { MODULE_TABLE_NAMES,  ModuleEdgesTableSchema } from "../../../types/schemas/moduleSchemas"
import { getDataBaseModuleService } from "../../options"
import express from "express";
import { hasPermission } from "../users";
import { API_KEYS, MyRequest } from "../../../types/server";
import { PERMISSION, RESOURCE } from "../../../types/user";
import { accessDenied } from "../../functions/database";
import messages from "../../messages";
import { OmitId } from "../../../types/materials";
import { DefaultSchema, TABLE_NAMES } from "../../../types/schemas/schemas";
import { getApiKey } from "../settings";

const router = express.Router();
export default router


export async function getModuleEdges() {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.getData(MODULE_TABLE_NAMES.EDGES, [], {})
}

export async function addModuleEdge(data: OmitId<ModuleEdgesTableSchema>) {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.addData(MODULE_TABLE_NAMES.EDGES, { ...data })
}

export async function removeModuleEdge(id: number) {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.deleteData(MODULE_TABLE_NAMES.EDGES, { id })
}

export async function updateModuleEdge(data: ModuleEdgesTableSchema) {
    const service = getDataBaseModuleService<ModuleEdgesTableSchema>()
    return await service.updateData(MODULE_TABLE_NAMES.EDGES, { id: data.id }, data)
}



export async function getModuleIdNameData(table: TABLE_NAMES) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.getData(table, ["id", "name"], {})
}

export async function addModuleIdNameData(table: TABLE_NAMES, data: OmitId<DefaultSchema>) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.addData(table, { ...data })
}

export async function removeModuleIdNameData(table: TABLE_NAMES, id: number) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.deleteData(table, { id })
}

export async function updateModuleIdNameData(table: TABLE_NAMES, data: DefaultSchema) {
    const service = getDataBaseModuleService<DefaultSchema>()
    return await service.updateData(table, { id: data.id }, data)
}


router.get(MODULEPROJ_EDGES_ROUTE, async (req, res) => {
    if ((req as MyRequest).apiKey !== await getApiKey(API_KEYS.MODULEPROJECT)) {
        if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.READ]))) return accessDenied(res)
    }
    const result = await getModuleEdges();
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULEPROJ_EDGES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name, thickness, code1c } = req.body as ModuleEdgesTableSchema
    const result = await addModuleEdge({ name, thickness, code1c });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULEPROJ_EDGES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name, thickness, code1c } = req.body as ModuleEdgesTableSchema
    const result = await updateModuleEdge({ id, name, thickness, code1c });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULEPROJ_EDGES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleEdge(id);
  result.message = result.message
  res.status(result.status).json(result)
});




router.get(MODULEPROJ_GROOVES_ROUTE, async (req, res) => {
    if ((req as MyRequest).apiKey !== await getApiKey(API_KEYS.MODULEPROJECT)) {
        if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.READ]))) return accessDenied(res)
    }
    const result = await getModuleIdNameData(MODULE_TABLE_NAMES.GROOVES);
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULEPROJ_GROOVES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name } = req.body as DefaultSchema
    const result = await addModuleIdNameData(MODULE_TABLE_NAMES.GROOVES, { name });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULEPROJ_GROOVES_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name } = req.body as DefaultSchema
    const result = await updateModuleIdNameData(MODULE_TABLE_NAMES.GROOVES, { id, name });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULEPROJ_GROOVES_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleIdNameData(MODULE_TABLE_NAMES.GROOVES, id);
  result.message = result.message
  res.status(result.status).json(result)
});



router.get(MODULEPROJ_COMMENTS_ROUTE, async (req, res) => {
    if ((req as MyRequest).apiKey !== await getApiKey(API_KEYS.MODULEPROJECT)) {
        if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.READ]))) return accessDenied(res)
    }
    const result = await getModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS);
    if (!result.success) return res.sendStatus(result.status)
    res.status(result.status).json(result);
});

router.post(MODULEPROJ_COMMENTS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.CREATE]))) return accessDenied(res)
    const { name } = req.body as DefaultSchema
    const result = await addModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS, { name });
    result.message = (result.success && messages.DATA_ADDED) || result.message
    res.status(result.status).json(result)
});

router.put(MODULEPROJ_COMMENTS_ROUTE, async (req, res) => {
    if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.UPDATE]))) return accessDenied(res)
    const { id, name } = req.body as DefaultSchema
    const result = await updateModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS, { id, name });
    result.message = (result.success && messages.DATA_UPDATED) || result.message
    res.status(result.status).json(result)
});

router.delete(MODULEPROJ_COMMENTS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.MODULEPROJECT, [PERMISSION.DELETE]))) return accessDenied(res)
  const { id } = req.body
  const result = await removeModuleIdNameData(MODULE_TABLE_NAMES.COMMENTS, id);
  result.message = result.message
  res.status(result.status).json(result)
});