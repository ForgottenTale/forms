import styles from '../../styles/RadioButton.module.css'

export default function RadioButton({ label, onClick, checked}) {
    // console.log(checked)
    return (
        <div className={styles.radioButton}>
            <input className={styles.radio} type="radio" onChange={onClick} checked={checked} />
            <label onClick={onClick}>{label}</label>
        </div>
    )
}