
import styles from './Styles.module.css';
import Input from '../../ui-component/CustomInput/input3';
import { useState } from 'react';
import Loader from '../../ui-component/loader';
import { Formik, getIn } from 'formik';
import * as yup from 'yup';


export default function CreateDiscountCodes({ setModal, handleSubmit, loading, disabled }) {


  let schema = yup.object().shape({
    code: yup.string().required("Required"),
    ieee: yup.number("Must be a number").required("Required"),
    industry: yup.number("Must be a number").required("Required"),
    acadmic: yup.number("Must be a number").required("Required"),
    specific: yup.string(),
    expiryDate:yup.string()

  });
  return (

    <div className={styles.modal}>
      <div className={styles.modal_overlay} onClick={() => setModal(false)}>

      </div>
      <Formik
        initialValues={{ code: "", ieee: 0, industry: 0, acadmic: 0, specific: "",expiryDate:"" }}
        validationSchema={schema}
        onSubmit={(values) => { handleSubmit(values) }}
      >
        {({ values, setFieldValue, handleSubmit, errors }) => (

          <div className={styles.modal_con}>

            <h4>Create new discound code</h4>
            {disabled ? <Loader /> : <>
              <Input
                label="Discount code *"
                value={values.code}
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
                label="Non IEEE Member Industry *"
                value={values.industry}
                placeholder="Enter the amount"
                error={getIn(errors, "ieee") !== undefined ? true : false}
                errMsg={getIn(errors, "ieee") !== undefined ? getIn(errors, "ieee") : ""}
                onChange={(e) => setFieldValue("industry", e.target.value)} />
              <Input
                label="IEEE Member Acadamic *"
                value={values.acadmic}
                placeholder="Enter the amount"
                error={getIn(errors, "ieee") !== undefined ? true : false}
                errMsg={getIn(errors, "ieee") !== undefined ? getIn(errors, "ieee") : ""}
                onChange={(e) => setFieldValue("acadmic", e.target.value)} />
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
              {/* {JSON.stringify(values, null, 2)} */}

              <div className={styles.modal_con_buttons}>
                <button
                  className={disabled ? styles.buttons_first : styles.buttons_first}
                  disabled={loading || disabled}
                  type="submit"
                  onClick={() => {
                    if (!disabled) {
                      handleSubmit()
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
        )}
      </Formik>




    </div>

  )
}