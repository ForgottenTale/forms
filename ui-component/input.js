
import { getIn } from 'formik';
import styles from '../styles/Input.module.css';
import { useEffect, useState } from 'react';

export default function Input({ label, placeholder, value, setFieldValue, name, errors }) {

    const [place, setPlace] = useState(value[name] !== "" ? false : true);

    useEffect(() => {
        if (value[name] === "") {
            setPlace(true)
        }
    }, [value[name]])
    return (
        <div className={styles.inputContainer2}  onClick={() => setPlace(false)}>
            <div className={styles.inputContainer}  >
                {/* <p className="label"> {label}</p> */}
                
                <input
                    value={value[name]}
                    onChange={(e) => setFieldValue(name, e.target.value)}
                    className={styles.input}

                />
                {place ? <p className={styles.placeholder}>{placeholder}</p> : null}
               
            </div>
            <p className={styles.errorMsg}>{getIn(errors, name)!==undefined?getIn(errors, name):""}</p>
                
        </div>



    );
}