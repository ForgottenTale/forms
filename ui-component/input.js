
import { getIn } from 'formik';
import styles from '../styles/Input.module.css';
import { useEffect, useState } from 'react';

export default function Input({ placeholder, value, setFieldValue, name, errors }) {

    const [place, setPlace] = useState(value[name] !== "" ? false : true);

    useEffect(() => {
        if (value[name] === "" || value[name] === null || value[name] === undefined) {
            setPlace(true)
        }
    }, [value[name]])

    return (
        <div className={styles.inputContainer2} onClick={() => setPlace(false)} onFocus={() => setPlace(false)}>
            <div className={styles.inputContainer}  >
                <input
                    value={value[name]}
                    onChange={(e) => {
                        if (place) {
                            setPlace(false)
                        }
                        setFieldValue(name, e.target.value)
                    }}
                    className={styles.input}
                />
                {place ? <p className={styles.placeholder}>{placeholder}</p> : null}

            </div>
            <p className={styles.errorMsg}>{getIn(errors, name) !== undefined ? getIn(errors, name) : ""}</p>
        </div>
    );
}