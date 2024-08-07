import messages from '../../messages.js'
import { MaterialService } from '../../services/materialService.js';
import { NewProfile, Profile } from '../../../types/materials.js';
import { materialsPath } from '../../options.js';
import MaterialServiceSQLite from '../../services/materialServiceSQLite.js';
import { StatusCodes } from 'http-status-codes';

export async function getProfiles() {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  return await materialService.getProfiles()
}

export async function addProfile({ name, type, code, brush }: Profile) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getProfiles()
  if (!result.success) return result
  const profiles = result.data
  if ((profiles as Profile[]).find(m => m.name === name && m.type === type)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.addProfile({ name, type, code, brush })
}

export async function updateProfile({ name, newName, type, code, brush }: NewProfile) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getProfiles()
  if (!result.success) return result
  const profiles = result.data
  if (!(profiles as Profile[]).find(m => m.name === name && m.type === type)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  if ((profiles as Profile[]).find(m => m.name === newName)) return { success: false, status: StatusCodes.CONFLICT, message: messages.MATERIAL_EXIST }
  return await materialService.updateProfile({ name, type, newName, code, brush })
}

export async function deleteProfile(name: string, type: string) {
  const materialService = new MaterialService(new MaterialServiceSQLite(materialsPath))
  const result = await materialService.getProfiles()
  if (!result.success) return result
  const profiles = result.data
  if (!(profiles as Profile[]).find(m => m.name === name && m.type === type)) return { success: false, status: StatusCodes.NOT_FOUND, message: messages.MATERIAL_NO_EXIST }
  return await materialService.deleteProfile(name, type)
}



