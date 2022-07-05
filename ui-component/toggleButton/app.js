import React from 'react';
import { useState } from 'react';
import styles from './styles.module.css'

export default function ToggleButton({onChange,state,label}) {

    const[toggle,setToggle] = useState(state);

    return (
        <div className={styles.togglebutton}>
           {label? <p>No</p>:null}
            <div className={styles.togglebutton_outer} onClick={()=>{setToggle(!toggle)
            onChange()
            }}>
                <div className={toggle?styles.togglebutton_inner_active:styles.togglebutton_inner}>

                </div>
            </div>
            {label? <p>Yes</p>:null}
        </div>
    )
}
