
import Select from 'react-select'
import styles from '../styles/Select.module.css'
import { getIn } from 'formik';

export default function Select2({ options, label, name, errors,value,setFieldValue }) {
    

    return (
        <div className={styles.selectContainer}>
            <p className={styles.label}> {label}</p>
            <Select value={value} options={options} instanceId onChange={(e)=>setFieldValue(name,e.value)}/>
            <p className={styles.errorMsg}>{getIn(errors, name) !== undefined ? getIn(errors, name) : ""}</p>

        </div>

    );
}

