import styles from './Styles.module.css'


export default function TextArea({label,placeholder,value,onChange}) {
    return (
        <div className={styles.styles.inputContainer}>
            <p className={styles.styles.label}> {label}</p>
            <textarea placeholder={placeholder} value={value} onChange={onChange} className={styles.styles.input}/>
        
        </div>


    );
}