
import style from "./style.module.css"
import GridIcon from "../../icons/grid"
import CreateIcon from "../../icons/create"
import CameraIcon from "../../icons/camera"
import SettingsIcon from "../../icons/settings"
import { useRouter } from 'next/router'
import { useState } from "react"

function Icon({ label, children }) {
    const [show, setShow] = useState(false);

    return (
        <div className={style.icons} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            {children}
            {show ? <div className={style.label}>
                <p>{label}</p>
            </div> : null}
        </div>
    )
}

export default function FormBackLayout({ children }) {
    const router = useRouter();
    const formId = router.query.formId
    return (
        <>
            <div className={style.menu}>
                <Icon label="Home">
                    <img width={25} height="25" src="/logo.png" />
                </Icon>
                <Icon label="Responses">
                    <GridIcon
                        onClick={() => router.push(`/${formId}/responses`)}
                        className={style.icon}
                        style={router.pathname.includes("responses") ? { stroke: "#1479ff" } : {}} />
                </Icon>
                <Icon label="Pricing">
                    <CreateIcon 
                    onClick={() => router.push(`/${formId}/pricing`)} 
                    className={style.icon} 
                    style={router.pathname.includes("pricing") ? { stroke: "#1479ff" } : {}}  />
                </Icon>
                <Icon label="Validate">
                    <CameraIcon 
                    onClick={() => router.push(`/${formId}/validate`)} 
                    className={style.icon} 
                    style={router.pathname.includes("validate") ? { stroke: "#1479ff" } : {}} />
                </Icon>
                <Icon onClick={() => router.push("settings")} label="Settings">
                    <SettingsIcon 
                    onClick={() => router.push(`/${formId}/settings`)} 
                    className={style.icon} 
                    style={router.pathname.includes("settings") ? { stroke: "#1479ff" } : {}} />
                </Icon>
            </div>
            <main className={style.container}>
                <div></div>
                {children}
            </main>

        </>
    )

}