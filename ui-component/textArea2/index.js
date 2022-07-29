import styles from './Styles.module.css'


export default function TextArea2({label,placeholder,value,onChange}) {
    return (
        <div className={styles.inputContainer}>
            <p className={styles.label}> {label}</p>
            <textarea placeholder={placeholder} value={value} onChange={onChange} className={styles.input}/>
        
        </div>


    );
}