import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Input from '../ui-component/input'
import { Formik, useFormikContext, getIn } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Loader from '../ui-component/loader';
import { useState, useEffect, useRef } from 'react';
import Error from '../ui-component/error';
import styles2 from '../styles/Wlc.module.css'
import Select from 'react-select';
import CustomRadio from '../ui-component/CustomRadio';
import CustomRadio2 from '../ui-component/CustomRadio2';
import loadScript from '../utils/razorpayScript';
import { useRouter } from 'next/router'
import PromoCode from '../ui-component/promocode';
// import pricing from '../utils/pricing';

export default function Home({ pricing: price, members }) {

  const initialRender = useRef(true);
  const router = useRouter()
  const customStyles = {
    control: () => ({
      padding: "0",
      display: "flex",
      color: "white",
      height: "35px",
      backgroundColor: "transparent",
      marginBottom: "30px",
      borderBottom: "1px white solid",

    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
      fontSize: "14px",
      margin: 0,
      padding: 0
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: '#ffffff',
        fontSize: "14px",
        margin: 0,
        padding: 0
      }
    },
    valueContainer: (defaultStyles) => ({
      ...defaultStyles,
      margin: 0,
      padding: 0
    }),
    indicatorSeparator: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "white"
    }),
    indicatorContainer: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "white",
      color: "white"
    })
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pricing, setPricing] = useState(price)
  const [errorMsg, setErrorMsg] = useState(false);

  // const user = {
  //   email: "abhijithkannan452@gmail.com",
  //   name: "Abhijith Kannan",
  //   phone: "7025263554",
  //   gender: "male",
  //   membershipType: "IEEE member",
  //   membershipId: 12345,
  //   institute: "College of Engineering Kidangoor",
  //   role: "Student",
  //   location: "Kottayam",
  //   food: "Veg",
  //   amount: null
  // }
  const user = {
    email: "",
    name: "",
    phone: undefined,
    gender: "",
    membershipType: "",
    membershipId: undefined,
    institute: "",
    role: "",
    location: "",
    food: "",
    amount: null,
    accommodation: "",
    promoCode: "default"
  }

  let schema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    phone: yup.number().required(),
    gender: yup.string().required(),
    membershipType: yup.string().required(),
    membershipId: yup.number(),
    institute: yup.string().required(),
    role: yup.string().required(),
    location: yup.string().required(),
    food: yup.string().required(),
    accommodation: yup.string().required(),
    amount: yup.string().required(),
    promoCode: yup.string()
  });
  async function displayRazorpay(data, values) {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const options = {
      key: data.key,
      currency: data.currency,
      amount: String(data.amount),
      order_id: data.id,
      name: 'IEEE Job Fair 2022',
      description: 'Thank you for registering',

      handler: async (response) => {
        try {
          await axios.post(`/api/pay/razorpay/verify?formId=wlc&orderId=${response.razorpay_order_id}`, response)
          router.push(`/confirmation/wlc/${response.razorpay_order_id}`)
        } catch (err) {
          setError(true)
          setErrorMsg(err.response !== undefined ? err.response.data.error : err)
          setLoading(false);
        }

      },
      prefill: {
        name: `${values.name}`,
        email: values.email,
        contact: `+91${values.phone}`
      }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    paymentObject.on('payment.failed', async (response) => {

      try {
        await axios.post(`/api/pay/razorpay/failed?formId=wlc`, response.error)
        router.push(`/confirmation/wlc/${response.error.metadata.order_id}`)
        paymentObject.close()
      } catch (err) {
        setError(true)
        setErrorMsg(err.response !== undefined ? err.response.data.error : err)
        setLoading(false);
      }
    });
  }

  const TrackMemberShipID = () => {

    const { values, setFieldValue } = useFormikContext();
    useEffect(() => {
      if (initialRender.current) {
        initialRender.current = false;

      } else {
        if (values.membershipId !== undefined && values.membershipId.length > 7) {
          setFieldValue("promoCode", members.some((val) => Number(values.membershipId) === Number(val)) ? "IEEEMember" : "default")
        } else {
          setFieldValue("promoCode", "default")
        }
      }

    }, [values.membershipId]);

    return null;

  }

  function buildForm(values) {

    var formData = new FormData()
    var key = Object.keys(values)

    key.forEach((val) => {
      formData.append(val, values[val])
    })
    return formData;
  }

  const handleDiscounts = (val, setFieldValue) => {
    if (pricing[val] !== undefined) {
      setFieldValue("promoCode", val);
    }
  }

  const handleUpload = async (values) => {
    setLoading(true);
    try {
      const formData = buildForm(values)
      const res = await axios.post(`/api/pay/razorpay?formId=wlc`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }

        }
      )
      displayRazorpay(res.data, values)
    }
    catch (err) {
      setError(true)
      setErrorMsg(err.response !== undefined ? String(err) : String(err))
      setLoading(false);
    }

  }

  const options = [{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }];

  return (
    <div className={styles.container}>
      <Head>
        <title>WIE ILS 2022 - IEEE Kerala Section</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ?
        <div className={styles2.loaderContainer}>
          <div>
            <Loader />
            <p className={styles2.loaderMsg}>Don&apos;t refresh this page. Redirecting to payment processing service ...</p>
          </div>

        </div>
        :
        <main className={styles2.main}>
          <div className={styles2.eventform}>
            {error ? <Error setError={setError} msg={errorMsg} /> : null}
            <div className={styles2.eventform_con}>
              <div className={styles2.eventdetails}>
                <p className={styles2.eventdetails_dnt}>REGISTRATION FORM</p>
                <h3 className={styles2.eventdetails_title}>WIE ILS 2022 - IEEE Kerala Section</h3>

              </div>
              <Formik
                initialValues={user}
                validationSchema={schema}
                onSubmit={(values) => { handleUpload(values) }}
              >
                {({ values, setFieldValue, handleSubmit, errors }) => (
                  <>
                    <Input
                      placeholder={"Your NAME *"}
                      value={values}
                      name="name"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>

                    <Input
                      placeholder={"Email *"}
                      value={values}
                      name="email"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>

                    <Input
                      placeholder={"Phone *"}
                      value={values}
                      name="phone"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>

                    <Select
                      placeholder={"Gender *"}
                      instanceId
                      styles={customStyles}
                      options={options}
                      onChange={(e) => setFieldValue("gender", e.value)}
                    />

                    <CustomRadio
                      label={"Are you an IEEE Member ? *"}
                      name="membershipType"
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={getIn(errors, "membershipType") !== undefined ? getIn(errors, "membershipType") : ""}
                      options={["IEEE member", "Non - IEEE Academic", "Non - IEEE Industrial"]} />

                    <Input
                      placeholder={"ieee membership id"}
                      value={values}
                      name="membershipId"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>
                    <TrackMemberShipID />
                    <Input
                      placeholder={"College / Institution *"}
                      value={values}
                      name="institute"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>

                    <Input
                      placeholder={"Current Role / Position *"}
                      value={values}
                      name="role"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>

                    <Input
                      placeholder={"Current Location *"}
                      value={values}
                      name="location"
                      setFieldValue={setFieldValue}
                      errors={errors}></Input>
                    <CustomRadio
                      label={"Do you require accommodation prior or after the event ? *"}
                      name="accommodation"
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={getIn(errors, "accommodation") !== undefined ? getIn(errors, "accommodation") : ""}
                      options={["Yes", "No"]} />

                    <CustomRadio
                      label={"Food Preference *"}
                      name="food"
                      values={values}
                      setFieldValue={setFieldValue}
                      errors={getIn(errors, "food") !== undefined ? getIn(errors, "accommodation") : ""}
                      options={["Veg", "Non-Veg"]} />

                    <CustomRadio2
                      label={"Pricing *"}
                      name="amount"
                      value={JSON.parse(values["amount"])}
                      onClickFns={(val) => {
                        setFieldValue("amount", JSON.stringify(val))
                      }}
                      errors={getIn(errors, "food") !== undefined ? getIn(errors, "food") : ""}
                      options={pricing[values.promoCode].packages} />

                    <PromoCode
                      placeholder="Promo codes"
                      // onChange={(val) => handleDiscounts(val)}
                      onClick={(val) => handleDiscounts(val, setFieldValue)
                      }
                    />
                    {/* <input  onChange={(val) => handleDiscounts(val.target.value)}/> */}
                    <button type='onSubmit' className={styles2.button} onClick={handleSubmit}>
                      SUBMIT
                    </button>
                    {/* {JSON.stringify(values, null, 2)} */}

                  </>
                )}

              </Formik>
            </div>
          </div>
        </main>}

    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const price = await axios.get(process.env.NODE_ENV !== "development" ? "https://forms.ieee-mint.org/api/form/pricing?formId=wlc" : "http://localhost:3000/api/form/pricing?formId=wlc")

    return {
      props: price.data
    }

  } catch (err) {
    console.log(err)
    return {
      props: {
        pricing: {}
      }
    }
  }
}