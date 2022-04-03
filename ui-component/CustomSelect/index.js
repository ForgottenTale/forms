import styles from './Select.module.css'
import { useState } from 'react';

export default function CustomSelect() {

    const [state, setState] = useState(false)
    return (
        <div className={styles.customSelect} >
            <div onClick={() => setState(s => !s)}>
                Select
            </div>

            {state ? <div className={styles.options}>
                <p onClick={() => setState(s => !s)} className={styles.option}> AUDI</p>
                <p onClick={() => setState(s => !s)} className={styles.option}> AUDI</p>
                <p onClick={() => setState(s => !s)} className={styles.option}> AUDI</p>
                <p onClick={() => setState(s => !s)} className={styles.option}> AUDI</p>
                <p onClick={() => setState(s => !s)} className={styles.option}> AUDI</p>
            </div> : null}
        </div>
    );
}