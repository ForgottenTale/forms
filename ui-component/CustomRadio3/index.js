import styles from './Radio.module.css'

export default function CustomRadio3({ label, options, value, onClickFns, error }) {


    const checked = (label) => {
        // console.log(`${label.label} === ${value.label}`)
        if (value !== null && value !== undefined) {
            if (label.label === value.label) {
                return true;
            }
            else {
                return false
            }
        }

    }
  
    return (
        <div className={styles.radio}>
            <p className={styles.label}>{label}</p>
            {options.map((val, key) => <div className={styles.option} key={key}>
                <input type="radio" checked={checked(val) ? true : false} onChange={() => onClickFns(val)} />
                <label className={styles.option_label} onClick={() => onClickFns(val)}>{val.label + " Rs "}{new Date() < new Date(val.expries) ?
                    val.earlyBirdAmount : val.amount}</label>
            </div>)
            }
            <p className={styles.errorMsg}>{error}</p>
        </div>
    )
}