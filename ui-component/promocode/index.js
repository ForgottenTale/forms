import styles from '../../styles/PromoCode.module.css';
import { useEffect, useState } from 'react';

export default function PromoCode({ placeholder, onClick,onChange }) {
    const [value, setValue] = useState("")
    const [place, setPlace] = useState(value !== "" ? false : true);

    useEffect(() => {
        if (value === "" || value === null || value === undefined) {
            setPlace(true)
        }
    }, [value])

    return (
        <div className={styles.promocode}>
            <input
                value={value}
                onChange={(e) => {
                    if (place) {
                        setPlace(false)
                    }
                    // onChange(e.target.value)
                    setValue(e.target.value)
                }}
                className={styles.input}

            />
            {place ? <p className={styles.placeholder}>{placeholder}</p> : null}
            <button className={styles.button} onClick={()=>onClick(value)}>Apply</button>
        </div>
    )
}