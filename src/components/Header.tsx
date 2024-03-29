import User from "./User"
import { useAtomValue, useSetAtom } from "jotai"
import { userAtom } from "../atoms/users"
import ImageButton from "./ImageButton"
import { editMaterialDialogAtom, editPriceDialogAtom, editProfileDialogAtom, settingsDialogAtom, showEditUsersDialogAtom, showSchemaDialogAtom, showSpecificationDialogAtom } from "../atoms/dialogs"
import MenuSeparator from "./MenuSeparator"
import { isAdminAtLeast, isClientAtLeast, isEditorAtLeast } from "../server/functions/user"
import { downloadDatabaseAtom } from "../atoms/database"
export default function Header() {
  const user = useAtomValue(userAtom)
  const editMaterialDialog = useAtomValue(editMaterialDialogAtom)
  const editProfileDialog = useAtomValue(editProfileDialogAtom)
  const editPriceDialog = useAtomValue(editPriceDialogAtom)
  const showSpecificationDialog = useSetAtom(showSpecificationDialogAtom)
  const showSchemaDialog = useSetAtom(showSchemaDialogAtom)
  const showUserListDialog = useSetAtom(showEditUsersDialogAtom)
  const downloadDatabase = useSetAtom(downloadDatabaseAtom)
  const settingsDialog = useAtomValue(settingsDialogAtom)
  return <div className="header">
    <div className="file-buttons-bar">
      <ImageButton title="Настройки" icon="settingsButton" onClick={() => { settingsDialog?.current?.showModal() }} />
      {isEditorAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Редактор материалов" icon="editMaterials" onClick={() => { editMaterialDialog?.current?.showModal() }} />
          <ImageButton title="Редактор профилей" icon="editProfiles" onClick={() => { editProfileDialog?.current?.showModal() }} />
          <ImageButton title="Редактор спецификации" icon="editPrice" onClick={() => { editPriceDialog?.current?.showModal() }} />
        </>
        : <></>}
      {isClientAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Cпецификация" icon="specButton" onClick={() => { showSpecificationDialog() }} />
          <ImageButton title="Cхема" icon="schemaButton" onClick={() => { showSchemaDialog() }} />
        </>
        : <></>}
      {isAdminAtLeast(user.role) ?
        <>
          <MenuSeparator />
          <ImageButton title="Список пользователей" icon="userlistButton" onClick={() => { showUserListDialog() }} />
          <ImageButton title="Скачать базу данных" icon="downloadButton" onClick={() => { downloadDatabase() }} />
        </>
        : <></>}
    </div>
    <User />
  </div>
}