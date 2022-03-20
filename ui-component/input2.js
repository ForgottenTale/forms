
import { getIn } from 'formik';
import styles from '../styles/Input2.module.css'

export default function Input({ label, placeholder, value, setFieldValue, name, errors }) {
    return (
        <div className={styles.inputContainer}>
            <p className={styles.label}> {label}</p>
            <input placeholder={placeholder} value={value[name]} onChange={(e) => setFieldValue(name, e.target.value)} className={styles.input} />
            <p className={styles.errorMsg}>{getIn(errors, name) !== undefined ? getIn(errors, name) : ""}</p>
        </div>


    );
}