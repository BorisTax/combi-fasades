import { useAtomValue } from "jotai";
import NewYear from "./NewYear";
import {  useCurrentTheme } from "../../atoms/themes";
import { THEME_NEW_YEAR } from "../../types/settings";

export default function Decoration() {
    const currentTheme = useCurrentTheme()
    return <div className="decoration">
        {currentTheme.id === THEME_NEW_YEAR ? <NewYear /> : <></>}
    </div>
}