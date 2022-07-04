
import styles from './Styles.module.css';
import * as XLSX from 'xlsx/xlsx.mjs';
import { useState } from 'react';

export default function AddResponses({ setModal, handleSubmit, loading, disabled }) {

  const [data, setData] = useState([]);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log(jsonData)
    setData(jsonData);
  }

  return (

    <div className={styles.modal}>
      <div className={styles.modal_overlay} onClick={() => setModal(false)}>

      </div>

      <div className={styles.modal_con}>

        <h4>Adding new responses</h4>
        {disabled ?

          <div className={styles.loader}><span className={styles.span}></span>
          </div> : <>

            <p style={{ fontSize: "12px" }}>To add new data to the form response, download the csv file given below. After adding data to the csv file, upload it to the box given.</p>
            <button
              className={disabled ? styles.buttons_first : styles.buttons_first}
              disabled={loading || disabled}
              onClick={() => window.open("/addresponses.xlsx")}>
              Download CSV
            </button>

            <h5 style={{ margin: "15px 0" }}>Upload CSV file</h5>
            <input type="file" onChange={handleFile} />
            <div className={styles.modal_con_buttons}>
              <button
                className={disabled ? styles.buttons_first : styles.buttons_first}
                disabled={loading || disabled}
                onClick={() => {
                  if (!disabled) {
                    handleSubmit(data)
                  }
                }}>
                Upload

              </button>
              <button
                className={disabled ? styles.buttons_first : styles.buttons_first}
                disabled={loading || disabled}
                onClick={() => {
                  if (!disabled) {
                    setModal(false)
                  }
                }}>
                Cancel
              </button>

            </div>
          </>}
      </div>


    </div>

  )
}