
import styles from './Styles.module.css';
import moment from 'moment';

export default function ViewDiscountCodes({ setModal, data }) {

  return (

    <div className={styles.modal}>
      <div className={styles.modal_overlay} onClick={() => setModal(false)}>

      </div>

      <div className={styles.modal_con}>

        <h4>Discount Code : {data.code}</h4>
        <i className={styles.modal_p}>GST Included</i>
        {data.packages !== undefined ?
          <table className={styles.table}>
            <tbody >
            <tr className={styles.row}>
              <th> <p className={styles.modal_p2}> IEEE </p></th>
              <th> <p className={styles.modal_p2}>Rs {data.packages[0].amount}</p></th>
            </tr>
            <tr className={styles.row}>
              <th> <p className={styles.modal_p2}>Non IEEE Acadamic </p></th>
              <th> <p className={styles.modal_p2}>Rs {data.packages[1].amount}</p></th>
            </tr>
            <tr className={styles.row}>
              <th> <p className={styles.modal_p2}>Non IEEE Industry </p></th>
              <th> <p className={styles.modal_p2}>Rs {data.packages[2].amount}</p></th>
            </tr>
            <tr className={styles.row}>
              <th> <p className={styles.modal_p2}>Expiry Date </p></th>
              <th> <p className={styles.modal_p2}>{data.expiryDate !== null ? moment(data.expiryDate).format("LLLL") : "None"}</p></th>
            </tr>
            <tr className={styles.row}>
              <th> <p className={styles.modal_p2}>Specify  </p></th>
              <th> <p className={styles.modal_p2}>{data.specific !== undefined &&data.specific !== ""? data.specific : "None"}</p></th>
            </tr>
            </tbody>
          </table> : null}


      </div>


    </div>

  )
}