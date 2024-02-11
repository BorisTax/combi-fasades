import fs from 'fs'
import UserServiceSQLite from './services/userServiceSQLite.js'
import { UserService } from './services/userService.js'
import { MyRequest, RequestBody, Result, Results, Token } from '../types/server.js'
import { Response, NextFunction } from "express"

export const userServiceProvider = new UserServiceSQLite('./database/database.db')

const expiredInterval = 3600 * 1000
const clearExpiredTokens = () => {
  const userService = new UserService(userServiceProvider)
  userService.getTokens().then((tokenList: Results) => {
    (tokenList.data as Token[]).forEach((t: Token) => { 
      if (Date.now() - t.time > expiredInterval) userService.deleteToken(t.token) })
  })
}
setInterval(clearExpiredTokens, 60000)

export const userRoleParser = async (req: MyRequest, res: Response, next: NextFunction) => {
  const userService = new UserService(userServiceProvider)
  const token = (req.body as RequestBody).token || ""
  const user = await userService.getUser(token)
  if (user) {
    req.userRole = user.role
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

