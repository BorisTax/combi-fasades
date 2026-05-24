import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../atoms/users"
import { RESOURCE } from "../types/user"
import EditContainer from "./EditContainer"
import TableData, { TableDataRow } from "./inputs/TableData"
import EditDataSection, { EditDataItem } from "./dialogs/EditDataSection"
import { InputType, PropertyType } from "../types/property"
import { ExtMap } from "../atoms/storage"
import { ApiKeySchema } from "../types/settings"
import { addApiKey, deleteApiKey, loadApiKeys, updateApiKey } from "../atoms/settings"

export default function EditApiKeys() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.SETTINGS)
    const [data, setData] = useState<ExtMap<ApiKeySchema>>(new Map())
    const dataList = [...data.keys()].filter(id => id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id'}, { caption: 'Ресурс' }, { caption: 'API Ключ' }]
    const contents: TableDataRow[] = dataList.map(d => ({ key: d, data: [d, data.get(d)?.resource, data.get(d)?.key] }))
    const editItems: EditDataItem[] = [
        { title: "id:", value: selectedId, inputType: InputType.TEXT, propertyType: PropertyType.INTEGER_POSITIVE_NUMBER, checkValue: (value) => ({ success: (value as number) > 0, message: "Введите ID" }) },
        { title: "Ресурс:", value: data.get(selectedId)?.resource || "" , inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите ресурс" }) },
        { title: "API ключ:", value: data.get(selectedId)?.key || "" , inputType: InputType.TEXT, checkValue: (value) => ({ success: (value as string).trim() !== "", message: "Введите API ключ" }) },
    ]
    const loadData = () => loadApiKeys().then(data => { setData(data); setSelectedId([...data.keys()][0] || 0) })
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !data.has(selectedId),
                question: (values) => `Обновить:\nid=${selectedId}\nРесурс: ${values[1]}\nAPI ключ: ${values[2]}`,
                onAction: async (values) => {
                    const id = values[0] as number 
                    const resource = values[1] as string
                    const key = values[2] as string  
                    const result = await updateApiKey({ id: selectedId, resource, key })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !data.has(selectedId),
                question: (values) => `Удалить:\nid=${selectedId}\nРесурс: ${values[1]}\nAPI ключ: ${values[2]}`,
                onAction: async () => {
                    const result = await deleteApiKey(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить:\nid=${selectedId}\nРесурс: ${values[1]}\nAPI ключ: ${values[2]}`,
                onAction: async (values) => {
                    const id = values[0] as number 
                    const resource = values[1] as string
                    const key = values[2] as string 
                    const result = await addApiKey({ id, resource, key })
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}


