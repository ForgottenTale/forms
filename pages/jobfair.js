

import Head from 'next/head';
import styles from '../styles/Job.module.css';
import Input from '../ui-component/input2';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import Loader from '../ui-component/loader';
import { useState } from 'react';
import Error from '../ui-component/error';
import Select from '../ui-component/select';
import DragandDrop from '../ui-component/draganddrop';
// import Radio from '../ui-component/radio';
import loadScript from '../utils/razorpayScript';
import CustomRadio3 from '../ui-component/CustomRadio3';
import { useRouter } from 'next/router'
import { getIn } from 'formik';


export default function Home() {
    const router = useRouter()
    function buildForm(values) {

        var formData = new FormData()
        var key = Object.keys(values)

        key.forEach((val) => {
            formData.append(val, values[val])
        })
        return formData;
    }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);

    // const user = {
    //     email: "abhijithkannan452@gmail.com",
    //     name: "Abhijith",
    //     phone: 1236851234,
    //     institute: "CEK",
    //     branch: "EEE",
    //     CGPA: 1.25,
    //     backlog: 0,
    //     membershipId: undefined,
    //     yearofPassout: 2021,
    //     ieeeMember: false,
    //     fileUpload: undefined,
    //     courseType: undefined,
    //     amount: null
    // }

    const user = {
        email: "",
        name: "",
        phone: undefined,
        institute: "",
        branch: "",
        CGPA: "",
        backlog: 0,
        membershipId: undefined,
        yearofPassout: undefined,
        ieeeMember: undefined,
        courseType: undefined,
        amount: null
    }

    const pricing = [

        {
            label: "IEEE Member",
            amount: 0,
            earlyBirdAmount: 0,
            expries: "2022-04-16T15:21:28.796Z"
        },
        {
            label: "Non IEEE members",
            amount: 0,
            earlyBirdAmount: 0,
            expries: "2022-04-16T15:21:28.796Z"
        }
    ]

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
                    await axios.post(`/api/pay/razorpay/verify?formId=jobfair&orderId=${response.razorpay_order_id}`, response)
                    router.push(`/confirmation/jobfair/${response.razorpay_order_id}`)
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
                await axios.post(`/api/pay/razorpay/failed?formId=jobfair`, response.error)
                router.push(`/confirmation/jobfair/${response.error.metadata.order_id}`)
                paymentObject.close()
            } catch (err) {
                setError(true)
                setErrorMsg(err.response !== undefined ? err.response.data.error : err)
                setLoading(false);
            }
        });
    }

    let schema = yup.object().shape({
        email: yup.string().email().required(),
        name: yup.string().required(),
        phone: yup.number().required(),
        institute: yup.string().required(),
        branch: yup.string().required(),
        CGPA: yup.number().required(),
        backlog: yup.number(),
        yearofPassout: yup.number().required(),
        ieeeMember: yup.boolean().required(),
        amount: yup.string().required("Required"),
        membershipId: yup.number().when('ieeeMember', (ieeeMember) => {
            if (ieeeMember) {
                return yup.number().required();
            }
            else {
                return yup.number()
            }
        }),
        fileUpload: yup.mixed().required(),
        courseType: yup.string().required()
    });


    const handleUpload = async (values) => {
        setLoading(true);

        // if ((values.ieeeMember && values === undefined) || (values.ieeeMember && values === "")) {
        //     setIeeeMemberErr(true)
        // }
        // else{
        try {
            var data = values
            data.membershipType = values.ieeeMember ? "IEEE Member" : "Non IEEE Member"
            const formData = buildForm(data)
            const res = await axios.post("/api/pay/razorpay?formId=jobfair", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }

                }
            )
            // await axios.post("https://securegw-stage.paytm.in/order/process",formData)
            // var details = {
            //     action: "https://securegw-stage.paytm.in/order/process",
            //     params: res.data
            // }

            // post(details);
            if (res.data.amount === 0) {
               router.push(`/confirmation/jobfair/${res.data.id}`)
            }
            else {
                displayRazorpay(res.data, values)
            }


        }
        catch (err) {
            setError(true)
            setErrorMsg(err.response !== undefined ? err.response.data.error : err)
            setLoading(false);
        }
        // }


    }

    const yop = [
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' },
        { value: '2020', label: '2020' }
    ]
    const options = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },

    ]
    const ct = [
        { value: 'Mtech', label: 'Mtech' },
        { value: 'Btech', label: 'Btech' },

    ]
    return (
        <div className={styles.container}>
            <Head>
                <title>IEEE Job Fair 2022</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.eventdetails_con} >
                    <img src={"./banner.jpeg"} className={styles.image} alt="BANNER" />

                    <div className={styles.eventdetails} >

                        <p className={styles.eventdetails_dnt} >REGISTRATION FORM</p>
                        <h3 className={styles.eventdetails_title} >IEEE Job Fair 2022</h3>
                    </div>
                </div>
                <div className={styles.eventform} >

                    {error ? <Error setError={setError} msg={errorMsg} /> : null}
                    {loading ?

                        <>
                            <Loader msg="Don&apos;t refresh this page. Redirecting to payment processing service ..." />

                        </>
                        :


                        <div className={styles.eventform_con} >
                            <Formik
                                initialValues={user}
                                validationSchema={schema}
                                onSubmit={(values) => { handleUpload(values) }}
                            >
                                {({ values, setFieldValue, handleSubmit, errors }) => (
                                    <>


                                        <Input label="Full Name *"
                                            placeholder={"Enter your name"}
                                            value={values}
                                            name="name"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        {/* <Input label="Last Name *"
                                            placeholder={"Enter your last name"}
                                            value={values}
                                            name="lastName"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input> */}
                                        <Input label="Email *"
                                            placeholder={"Enter your email addrees"}
                                            value={values}
                                            name="email"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        <Input label="Phone *"
                                            placeholder={"Enter your phone number"}
                                            value={values}
                                            name="phone"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        <Input label="College/Institution Name *"
                                            placeholder={"Enter your College/Institution name"}
                                            value={values}
                                            name="institute"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        <Input label="Branch *"
                                            placeholder={"Enter your branch"}
                                            value={values}
                                            name="branch"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        <Input label="CGPA *"
                                            placeholder={"Total CGPA till now"}
                                            value={values}
                                            name="CGPA"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        <Select
                                            label="Course type *"
                                            options={ct}
                                            name="courseType"
                                            value={[{ value: values["courseType"], label: values["courseType"] }]}
                                            setFieldValue={setFieldValue}
                                            errors={errors} />
                                        <Select
                                            label="Year of graduation *"
                                            options={yop}
                                            name="yearofPassout"
                                            value={[{ value: values["yearofPassout"], label: values["yearofPassout"] }]}
                                            setFieldValue={setFieldValue}
                                            errors={errors} />

                                        <Input label="Number of backlog (If any) "
                                            placeholder={""}
                                            value={values}
                                            name="backlog"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>
                                        <Select
                                            label="Are you an IEEE member? *"
                                            options={options}
                                            name="ieeeMember"
                                            value={[{ value: values["ieeeMember"], label: values["ieeeMember"] ? "Yes" : values["ieeeMember"] !== undefined ? "No" : undefined }]}
                                            setFieldValue={setFieldValue}
                                            errors={errors} />
                                        <Input label="IEEE Membership Number"
                                            placeholder={"If you are an IEEE member, please enter your valid IEEE membership number here"}
                                            value={values}
                                            name="membershipId"
                                            setFieldValue={setFieldValue}
                                            errors={errors}></Input>


                                        <DragandDrop
                                            label="Upload Resume *"
                                            accept='application/pdf'
                                            files={values}
                                            name="fileUpload"
                                            setFiles={setFieldValue}
                                            errors={errors} />

                                        <CustomRadio3
                                            label={"Pricing *"}
                                            name="amount"
                                            error={getIn(errors, "amount") !== undefined ? true : false}
                                            value={JSON.parse(values["amount"])}
                                            onClickFns={(val) => {
                                                setFieldValue("amount", JSON.stringify(val))
                                            }}
                                            errors={errors}
                                            options={pricing} />
                                        {/* <Radio
                                                label="Select your package"
                                                value={values}
                                                name="package"
                                                setFieldValue={setFieldValue}
                                                options={[
                                                    { value: 250, name: "IEEE Member" },
                                                    { value: 500, name: "Non IEEE Member" }
    
                                                ]}
                                                errors={errors} /> */}
                                        <button className={styles.button} onClick={handleSubmit}>
                                            SUBMIT
                                        </button>
                                        {/* {JSON.stringify(errors, null, 2)} */}

                                    </>
                                )}
                            </Formik>

                            <footer className={styles.footer}>
                                <p>This content is created by the owner of the form. The data you submit will be sent to the form owner. IEEE Kerala Section is not responsible for the privacy or security practices of its customers, including those of this form owner. Never give out your password.</p>
                                <br />Powered by IKS Mint Forms | <a style={{ color: "blue" }} href='https://ieee-mint.org/privacy'>Privacy and cookies</a> | <a style={{ color: "blue" }} href='https://ieee-mint.org/terms'>Terms of use</a>
                            </footer>
                        </div>

                    }

                </div>

            </main>

        </div>


    )
}


