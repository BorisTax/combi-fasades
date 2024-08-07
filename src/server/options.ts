import fs from 'fs'
import { UserService } from './services/userService.js'
import { MyRequest, RequestBody } from '../types/server.js'
import { Response, NextFunction, Request } from "express"
import UserServiceSQLite from './services/userServiceSQLite.js'
import path from 'path'
import { fileURLToPath } from 'url'
import PriceServiceSQLite from './services/priceServiceSQLite.js'
import TemplateServiceSQLite from './services/templateServiceSQLite.js'
import SpecificationServiceSQLite from './services/specificationServiceSQLite.js'
import MaterialServiceSQLite from './services/materialServiceSQLite.js'
import PermissionServiceSQLite from './services/permissionServiceSQLite.js'

export const JWT_SECRET = "secretkey"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databaseZipFile = path.resolve(__dirname, 'database.zip')
export const databaseFolder = path.resolve(__dirname, 'database')
export const usersPath = path.resolve(__dirname, 'database/users.db')
export const materialsPath = path.resolve(__dirname, 'database/materials.db')
export const specificationPath = path.resolve(__dirname, 'database/specification.db')
export const templatePath = path.resolve(__dirname, 'database/templates.db')
export const wardrobePath = path.resolve(__dirname, 'database/wardrobe.db')
export const materialServiceProvider = new MaterialServiceSQLite(materialsPath)
export const userServiceProvider = new UserServiceSQLite(usersPath)
export const priceServiceProvider = new PriceServiceSQLite(specificationPath)
export const specServiceProvider = new SpecificationServiceSQLite(specificationPath)
export const templateServiceProvider = new TemplateServiceSQLite(templatePath)
export const permissionServiceProvider = new PermissionServiceSQLite(usersPath)

export const userRoleParser = async (req: Request, res: Response, next: NextFunction) => {
  const userService = new UserService(userServiceProvider)
  let token = req.query.token as string
  token = (req.body as RequestBody).token || token || "";
  (req as MyRequest).token = token
  const result = await userService.getUser(token)
  const user = result.data && result.data[0]
  if (user) {
    const roleId = await userService.getUserRoleId(user?.name);
    (req as MyRequest).userRoleId = roleId
  }
  next()
}

function readFile(file: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject(err); else resolve(data);
    })
  })
}

