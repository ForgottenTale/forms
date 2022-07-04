
import style from "./style.module.css"
import GridIcon from "../../icons/grid"
import CreateIcon from "../../icons/create"
import CameraIcon from "../../icons/camera"
import SettingsIcon from "../../icons/settings"
import { useState } from "react"

function Icon({ label, children }) {
    const [show, setShow] = useState(false)
    return (
        <div className={style.icons} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}> 
            {children}
            {show ? <div className={style.label}>
                <p>{label}</p>
            </div> : null}
        </div>
    )
}

export default function FormBackLayout({ children }) {

    return (
        <main className={style.container}>
            <div className={style.menu}>
                <Icon label="Responses">
                    <GridIcon className={style.icon} style={{ stroke: "#1479ff" }} />
                </Icon>
                <Icon label="Pricing">
                    <CreateIcon className={style.icon} />
                </Icon>
                <Icon label="Validate">
                    <CameraIcon className={style.icon} />
                </Icon>
                <Icon label="Settings">
                    <SettingsIcon className={style.icon} />
                </Icon>
            </div>
            {children}
        </main>
    )

}