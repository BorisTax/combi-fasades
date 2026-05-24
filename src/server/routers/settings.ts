import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { hasPermission } from './users.js';
import { APIKEYS_ROUTE } from "../../types/routes.js";
import { ApiKeySchema } from "../../types/settings.js";
import { getSettingsService } from "../options.js";
import { SETTINGS_TABLE_NAMES } from "../../types/schemas/schemas.js";

const router = express.Router();
export default router

// router.put(THEME_ROUTE, async (req, res) => {
//   if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.UPDATE]))) return accessDenied(res)
//   const { id } = req.body
//   const result = await setTheme(id)
//   res.status(result.status).json(result);
// });

// router.get(THEME_ROUTE, async (req, res) => {
//   if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.READ]))) return accessDenied(res)
//   const result = await getThemes()
//   res.status(result.status).json(result);
// });



router.get(APIKEYS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.READ]))) return accessDenied(res)
    const result = await getApiKeys()
  res.status(result.status).json(result);
});

router.post(APIKEYS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, key, resource } = req.body as ApiKeySchema
  const result = await addApiKeys({ id, key, resource })
  res.status(result.status).json(result);
});

router.put(APIKEYS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id, key,resource } = req.body as ApiKeySchema
  const result = await updateApiKeys({ id, key, resource })
  res.status(result.status).json(result);
});

router.delete(APIKEYS_ROUTE, async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.SETTINGS, [PERMISSION.UPDATE]))) return accessDenied(res)
  const { id } = req.body as ApiKeySchema
  const result = await deleteApiKeys(id)
  res.status(result.status).json(result);
});



export async function getApiKey(id: number) {
  const keys = (await getApiKeys()).data
  return keys.find(k => k.id === id)?.key
}

async function getApiKeys() {
  const service = getSettingsService<ApiKeySchema>()
  return service.getData(SETTINGS_TABLE_NAMES.API_KEYS, [], {})
}

async function addApiKeys(data: ApiKeySchema) {
  const service = getSettingsService<ApiKeySchema>()
  return service.addData(SETTINGS_TABLE_NAMES.API_KEYS, data)
}

async function updateApiKeys(data: ApiKeySchema) {
  const service = getSettingsService<ApiKeySchema>()
  return service.updateData(SETTINGS_TABLE_NAMES.API_KEYS, { id: data.id }, data)
}

async function deleteApiKeys(id: number) {
  const service = getSettingsService<ApiKeySchema>()
  return service.deleteData(SETTINGS_TABLE_NAMES.API_KEYS, { id })
}