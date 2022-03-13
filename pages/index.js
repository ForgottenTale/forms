import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Input from '../ui-component/input'
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Loader from '../ui-component/loader';
import { useState } from 'react';
import Error from '../ui-component/error';

export default function Home() {


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const user = {
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  }

  let schema = yup.object().shape({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.number().required()
  });
  function isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  function isObj(val) {
    return typeof val === 'object'
  }

  function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
      return JSON.stringify(val)
    } else {
      return val
    }
  }

  function buildForm({ action, params }) {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', stringifyValue(params[key]))
      form.appendChild(input)
    })

    return form
  }

  function post(details) {
    const form = buildForm(details)
    document.body.appendChild(form)
    form.submit()
    form.remove()
  }
  const handleUpload = async (values) => {
    // setLoading(true);
    try {
      const res = await axios.post("/api/pay", values, {
        "headers": {
          "Content-Type": "application/json"
        }
      })
      var details = {
        action: "https://securegw-stage.paytm.in/order/process",
        params: res.data
      }

      post(details);
    }
    catch (err) {
      // console.log(err.response.data);
      setError(true)
      setErrorMsg( err.response !== undefined ? String(err) : String(err))
      setLoading(false);
    }

  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
      <div className="eventform">
        {error ? <Error setError={setError} msg={errorMsg} /> : null}
        {loading ?

          <>
            <Loader />
            <p className='loaderMsg'>Don't refresh this page. Redirecting to payment processing service ...</p>
          </>
          :


          <div className="eventform_con">
            <div className="eventdetails">
              <p className="eventdetails_dnt">REGISTRATION</p>
              <h3 className="eventdetails_title">25th International conference on Science and Technology - Bangkok Thailand - September 2022</h3>
             
            </div>
            <Formik
              initialValues={user}
              validationSchema={schema}
              onSubmit={(values) => { handleUpload(values) }}
            >
              {({ values, setFieldValue, handleSubmit, errors }) => (
                <>
                  <Input label="First Name" placeholder={"Your NAME"} value={values} name="firstName" setFieldValue={setFieldValue} errors={errors}></Input>
                  <Input label="Last Name" placeholder={"Email"} value={values} name="lastName" setFieldValue={setFieldValue} errors={errors}></Input>
                  <Input label="Email" placeholder={"Phone"} value={values} name="email" setFieldValue={setFieldValue} errors={errors}></Input>
                  <Input label="Email" placeholder={"College / Institution"} value={values} name="email" setFieldValue={setFieldValue} errors={errors}></Input>
                  <Input label="Phone" placeholder={"ieee membership id"} value={values} name="phone" setFieldValue={setFieldValue} errors={errors}></Input>
                  <button className="button" onClick={handleSubmit}>
                   SUBMIT
                  </button>
                </>
              )}
            </Formik>


          </div>

        }

      </div>
    </main>
    
    </div>
  )
}
