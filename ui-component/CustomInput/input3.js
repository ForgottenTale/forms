
import styles from './Styles.module.css'

export default function Input({ label, placeholder, value, onChange, error }) {
    return (
        <div className={styles.inputContainer}>
            <p className={styles.label}> {label}</p>
            <input placeholder={placeholder} value={value}
                style={{
                  
                    outlineColor: error ? "red" : "#1479ff"

                }}
                onChange={onChange} className={styles.input} />
            {/* <p className={styles.errorMsg}>{getIn(errors, name) !== undefined ? getIn(errors, name) : ""}</p> */}
        </div>


    );
}