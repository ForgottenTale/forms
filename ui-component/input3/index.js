import styles from './Styles.module.css'


export default function Input3({label,placeholder,value,onChange,errors}) {
    return (
        <div className={styles.inputContainer}>
            <p className={styles.label}> {label}</p>
            <input placeholder={placeholder} value={value} onChange={onChange} className={styles.input}/>
            <p style={{color:"red",fontSize:"12px"}}>{errors}</p>
        </div>


    );
}