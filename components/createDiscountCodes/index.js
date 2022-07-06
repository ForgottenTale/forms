
import styles from './Styles.module.css';
import Input from '../../ui-component/CustomInput/input3';
import Loader from '../../ui-component/loader';
import { Formik, getIn } from 'formik';
import * as yup from 'yup';

export default function CreateDiscountCodes({ setModal, handleSubmit, loading, data, disabled }) {

  let schema = yup.object().shape({
    code: yup.string().required("Required"),
    ieee: yup.number("Must be a number").required("Required"),
    industry: yup.number("Must be a number").required("Required"),
    acadmic: yup.number("Must be a number").required("Required"),
    specific: yup.string(),
    expiryDate: yup.string()

  });

  let initailData = {
    code: data !== undefined ? data.code : "",
    ieee: data !== undefined ? data.packages[0].amount / 1.18 : 0,
    acadmic: data !== undefined ? data.packages[1].amount / 1.18 : 0,
    industry: data !== undefined ? data.packages[2].amount / 1.18 : 0,
    specific: data !== undefined ? data.specific : "",
    expiryDate: ""
  }
  return (

    <div className={styles.modal}>
      <div className={styles.modal_overlay} onClick={() => setModal(false)}></div>
      <Formik
        initialValues={initailData}
        validationSchema={schema}
        onSubmit={(values) => { handleSubmit(values) }}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (

          <div className={styles.modal_con}>

            <h4>{data !== undefined ? "Update" : "Create new"} discound code</h4>
            {loading ? <Loader /> : <>
              <Input
                label="Discount code *"
                value={values.code}
                disabled={disabled}
                placeholder="Enter the discount code"
                error={getIn(errors, "code") !== undefined ? true : false}
                errMsg={getIn(errors, "code") !== undefined ? getIn(errors, "code") : ""}
                onChange={(e) => setFieldValue("code", e.target.value)} />
              <Input
                label="IEEE Member *"
                value={values.ieee}
                placeholder="Enter the amount"
                error={getIn(errors, "ieee") !== undefined ? true : false}
                errMsg={getIn(errors, "ieee") !== undefined ? getIn(errors, "ieee") : ""}
                onChange={(e) => setFieldValue("ieee", e.target.value)} />
              <Input
                label="IEEE Member Acadamic *"
                value={values.acadmic}
                placeholder="Enter the amount"
                error={getIn(errors, "ieee") !== undefined ? true : false}
                errMsg={getIn(errors, "ieee") !== undefined ? getIn(errors, "ieee") : ""}
                onChange={(e) => setFieldValue("acadmic", e.target.value)} />
              <Input
                label="Non IEEE Member Industry *"
                value={values.industry}
                placeholder="Enter the amount"
                error={getIn(errors, "ieee") !== undefined ? true : false}
                errMsg={getIn(errors, "ieee") !== undefined ? getIn(errors, "ieee") : ""}
                onChange={(e) => setFieldValue("industry", e.target.value)} />
              {/* <Input
                label="Expiry Date *"
                value={values.expiryDate}
                placeholder="Enter the data"
                type="date"
                error={getIn(errors, "expiryDate") !== undefined ? true : false}
                errMsg={getIn(errors, "expiryDate") !== undefined ? getIn(errors, "expiryDate") : ""}
                onChange={(e) => setFieldValue("expiryDate", e.target.value)} /> */}
              <Input
                label="Specify users"
                value={values.specific}
                placeholder="Enter the users ID"
                onChange={(e) => setFieldValue("specific", e.target.value)} />
    
              <div className={styles.modal_con_buttons}>
                <button
                  className={loading ? styles.buttons_first : styles.buttons_first}

                  type="submit"
                  onClick={() => {

                    handleSubmit()

                  }}>
                  Upload

                </button>
                <button
                  className={loading ? styles.buttons_first : styles.buttons_first}

                  onClick={() => {

                    setModal(false)

                  }}>
                  Cancel
                </button>

              </div>
            </>}

          </div>
        )}
      </Formik>




    </div>

  )
}