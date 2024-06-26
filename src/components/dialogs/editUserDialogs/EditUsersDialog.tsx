import { useEffect, useMemo, useRef, useState } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import useMessage from "../../../custom-hooks/useMessage"
import useConfirm from "../../../custom-hooks/useConfirm"
import ImageButton from "../../inputs/ImageButton"
import { activeUsersAtom, allUsersAtom, createUserAtom, deleteUserAtom, loadActiveUsersAtom, loadUsersAtom, logoutUserAtom, updateUserAtom, userAtom, userRolesAtom } from "../../../atoms/users"
import { timeToString } from "../../../server/functions/user"
import { RESOURCE } from "../../../types/user"
import { AtomCallbackResult } from "../../../types/atoms"
import { rusMessages } from "../../../functions/messages"
import EditPermissionsDialog from "./EditPermissionsDialog"
import TableData from "../../TableData"
import { useNavigate } from "react-router-dom"
import EditDataSection, { EditDataItem } from "../EditDataSection"
import { InputType } from "../../../types/property"
import messages from "../../../server/messages"
import EditContainer from "../../EditContainer"

export default function EditUsersDialog() {
    const navigate = useNavigate()
    const addUserDialogRef = useRef<HTMLDialogElement>(null)
    const { token, permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.USERS)
    const users = useAtomValue(allUsersAtom)
    const roles = useAtomValue(userRolesAtom)
    const userRoles = useMemo(() => roles.map(r => r.name), [roles])
    const activeUsers = useAtomValue(activeUsersAtom)
    const loadActiveUsers = useSetAtom(loadActiveUsersAtom)
    const loadUsers = useSetAtom(loadUsersAtom)
    const logoutUser = useSetAtom(logoutUserAtom)
    const createUser = useSetAtom(createUserAtom)
    const updateUser = useSetAtom(updateUserAtom)
    const deleteUser = useSetAtom(deleteUserAtom)
    const showMessage = useMessage()
    const showConfirm = useConfirm()
    const userListHeader = ["Имя", "Права"]
    const activeUserListHeader = ["Имя", "Права", "Время", "Время простоя"]
    const [userIndex, setUserIndex] = useState(0)
    const user = users[userIndex] || { name: "", role: { name: "" } }
    const userlist = users.map(u => {
        return [u.name, u.role.name]
    })
    const activeuserlist = activeUsers.map(u => {
        const you = u.token === token
        return [u.name,
        u.role.name,
        <TimeField key={u.token + "1"} time={u.time} />,
        <TimeField key={u.token + "2"} time={u.lastActionTime} />,
        <div key={u.token + "3"} className={you ? "text-center" : " text-center user-logout-button"} onClick={() => { if (!you) showConfirm(`Отключить пользователя ${u.name}?`, () => logoutUser(u.token)) }}>{you ? "Это вы" : "Отсоединить"}</div>]
    }
    )
    const userEditItems: EditDataItem[]=[
        {caption:"Имя:", type: InputType.TEXT, value: user.name, message: messages.ENTER_NAME},
        {caption:"Роль:", type: InputType.LIST, value: user.role.name, list: userRoles, message: messages.ENTER_ROLE},
        { caption: "Пароль:", type: InputType.TEXT, value: "", message: messages.ENTER_PASSWORD, checkValue: (value) => checkPassword(value as string) },
    ]
    useEffect(() => {
        if (!perm?.read) navigate("/")
    }, [perm?.read, navigate])
    useEffect(() => {
        loadUsers()
        loadActiveUsers()
    }, [perm, loadActiveUsers, loadUsers])
    return <div className="edit-user-container">
        <div className="d-flex gap-2">
            <ImageButton title="Обновить" icon='update' onClick={() => { loadUsers(); loadActiveUsers() }} />
        </div>
        <hr />
        Все пользователи
        <EditContainer>
            <TableData heads={userListHeader} content={userlist} onSelectRow={(index)=>setUserIndex(index)} />
            <EditDataSection items={userEditItems} name={user.name}
                onAdd={async (checked, values) => {
                    const name = values[0] as string
                    const role = values[1] as string
                    const password = values[2] as string
                    if (users.find(u => u.name === name)) { return { success: false, message: messages.USER_NAME_EXIST } }
                    const result = await createUser(name as string, password, { name: role })
                    return result
                }}
                onUpdate={async (checked, values) => {
                    const usedName = checked[0] ? values[0] : ""
                    const usedRole = checked[1] ? values[1] : ""
                    const usedPass = checked[2] ? values[2] : ""
                    if (!users.find(u => u.name === usedName)) { return { success: false, message: messages.USER_NAME_NO_EXIST } }
                    const result = await updateUser(usedName as string, usedPass as string, { name: usedRole as string })
                    return result
                }}
                onDelete={async (name) => {
                    const result = await deleteUser(name as string)
                    return result
                }} />
        </EditContainer>
        <hr />
        В сети
        <TableData heads={activeUserListHeader} content={activeuserlist} />
        <hr />
        <EditPermissionsDialog />
    </div>
}

function TimeField({ time }: { time: number }) {
    const [, rerender] = useState(0)
    useEffect(() => {
        const timeout = setTimeout(() => rerender(Math.random()))
        return () => clearTimeout(timeout)
    })
    return <div className="text-center">{timeToString(Date.now() - time)}</div>
}

function checkPassword(pass: string): {success: boolean, message: string}{
    if(pass.match("[^a-zA-Z0-9]")) return {success: false, message: messages.PASSWORD_INCORRECT}
    if(pass.length<=3) return {success: false, message: messages.PASSWORD_SHORT}
    return { success: true, message: "" }
}