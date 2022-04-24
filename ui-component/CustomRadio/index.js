import styles from './Radio.module.css'

export default function CustomRadio({ label, options, values, setFieldValue, name, errors }) {

    return (
        <div className={styles.radio}>
            <p className={styles.label}>{label}</p>
            {options.map((val, key) => <div className={styles.option} key={key}>
                <input type="radio" checked={val === values[name] ? true : false} onChange={() =>setFieldValue(name,val)} />
                <label className={styles.option_label} onClick={() =>setFieldValue(name,val)}>{val}</label>
            </div>)
            }
            <p className={styles.errorMsg}>{errors}</p>
        </div>
    )
}