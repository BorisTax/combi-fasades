import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { userAtom } from "../../atoms/users"
import { RESOURCE } from "../../types/user"
import EditContainer from "../EditContainer"
import TableData, { TableDataRow } from "../inputs/TableData"
import EditDataSection, { EditDataItem } from "../dialogs/EditDataSection"
import { InputType, PropertyType } from "../../types/property"
import { addModuleEdge, deleteModuleEdge, loadModulesEdges, updateModuleEdge } from "../../atoms/modules/edgesGroovesComments"
import { ExtMap } from "../../atoms/storage"
import { ModuleEdgesTableSchema } from "../../types/schemas/moduleSchemas"


export default function EditModuleEdges() {
    const { permissions } = useAtomValue(userAtom)
    const perm = permissions.get(RESOURCE.MODULEPROJECT)
    const [edges, setEdges] = useState<ExtMap<ModuleEdgesTableSchema>>(new Map())
    const edgesList = [...edges.keys()].filter(id => id !== 0)
    const [selectedId, setSelectedId] = useState(0)
    const heads = [{ caption: 'id' }, { caption: 'Наименование' }, { caption: 'Толщина' }, { caption: 'Код' }]
    const contents: TableDataRow[] = edgesList.map(id => ({ key: id, data: [id, edges.get(id)?.name, edges.get(id)?.thickness, edges.get(id)?.code1c] }))
    const editItems: EditDataItem[] = [
        { title: "Наименование:", value: edges.get(selectedId)?.name || "", inputType: InputType.TEXT, checkValue: (value) => ({ success: value !== "", message: "Введите наименование" }) },
        { title: "Толщина:", value: edges.get(selectedId)?.thickness || "", inputType: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER, checkValue: (value) => ({ success: value !== "", message: "Введите толщину" }) },
        { title: "Толщина:", value: edges.get(selectedId)?.code1c || "", inputType: InputType.TEXT, propertyType: PropertyType.POSITIVE_NUMBER, checkValue: (value) => ({ success: value !== "", message: "Введите код" }) },
    ]
    const loadData = () => loadModulesEdges().then(data => { setEdges(() => data); setSelectedId(() => [...data.keys()][0] || 0) })
    useEffect(() => {
        loadData()
    }, [])
    return <EditContainer>
        <div>
            <TableData rowNumbers={false} header={heads} content={contents} onSelectRow={value => { setSelectedId(value as number) }} />
        </div>
        {(perm?.Read) ? <EditDataSection items={editItems}
            onUpdate={perm?.Update ? {
                disabled: !edges.has(selectedId),
                question: (values) => `Обновить кромку:\nid=${selectedId}\n${values[0]}\nТолщина: ${values[1]}мм\nКод: ${values[2]}`,
                onAction: async (values) => {
                    const name = values[0] as string 
                    const thickness = values[1] as number 
                    const code1c = values[2] as string 
                    const result = await updateModuleEdge({ id: selectedId, name, thickness, code1c })
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onDelete={perm?.Delete ? {
                disabled: !edges.has(selectedId),
                question: (values) => `Удалить кромку:\nid=${selectedId}\nНаименование: ${values[0]}\nТолщина: ${values[1]}`,
                onAction: async () => {
                    const result = await deleteModuleEdge(selectedId)
                    if(result.success) loadData()
                    return result
                }
            } : undefined}
            onAdd={perm?.Create ? {
                question: (values) => `Добавить кромку:\n${values[0]}\nТолщина: ${values[1]}мм\nКод: ${values[2]}`,
                onAction: async (values) => {
                    const name = values[0] as string
                    const thickness = values[1] as number
                    const code1c = values[2] as string 
                    const result = await addModuleEdge({ name, thickness, code1c })
                    if(result.success) loadData()
                    return result
                }
            } : undefined} /> : <div></div>}
    </EditContainer>
}
