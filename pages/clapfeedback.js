import Head from "next/head";
import styles from "../styles/Feedback.module.css";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Loader from "../ui-component/loader";
import { useState, useEffect } from "react";
import Error from "../ui-component/error";
import { useRouter } from "next/router";
import EmojiSelector from "../ui-component/emojiSelector";
import TextArea2 from "../ui-component/textArea2";
import { getIn } from "formik";
import Input3 from "../ui-component/input3";
import jsonData from '../test.json';

function Rating({ event, name1, values, errors, setFieldValue }) {
  return (
    <>
      <EmojiSelector
        event={`${event} *`}
        onClick={(e) => setFieldValue(name1, e)}
        value={values[name1]}
        errors={getIn(errors, name1) !== undefined ? getIn(errors, name1) : ""}
      />
    </>
  );
}

export default function Home() {
  const { query } = useRouter();
  const router = useRouter();

  function buildForm(values) {
    var formData = new FormData();
    var key = Object.keys(values);

    key.forEach((val) => {
      formData.append(val, values[val]);
    });
    return formData;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const certiCheck = async () => {
    try {
      const res = await axios.get(
        `/api/form/certiCheck?id=${query.id}&formId=clapfeedback`
      );
      console.log(res);
      if (res.data.status) {
        setInitialLoading(false);
      } else {
        router.push(`/certificates/${res.data.id}.pdf`);
      }
    } catch (err) {
      setError(true);
      setErrorMsg(err.response !== undefined ? err.response.data.error : err);
      setLoading(false);
    }
    // setInitialLoading(false);
  };

  useEffect(() => {
    if (query.id !== undefined) {
      certiCheck();
    }
  }, [query.id]);

  const user = {
    name: "",
    email: "",
    session1: "",
    session2: "",
    session3: "",
    session4: "",
    session5: "",
    session6: "",
    session7: "",
    session8: "",
    session9: "",
    session10: "",
    session11: "",
    session12: "",
    session13: "",
   
    suggestions: "",
   
  };

  let schema = yup.object().shape({
    email: yup.string().email().required("Required"),
    name: yup.string().required("Required"),
 
    session1: yup.string().required("Required"),
    session2: yup.string().required("Required"),
    session3: yup.string().required("Required"),
    session4: yup.string().required("Required"),
    session5: yup.string().required("Required"),
    session6: yup.string().required("Required"),
    session7: yup.string().required("Required"),
    session8: yup.string().required("Required"),
    session9: yup.string().required("Required"),
    session10: yup.string().required("Required"),
    session11: yup.string().required("Required"),
    session12: yup.string().required("Required"),
    session13: yup.string().required("Required"),
    
    suggestions: yup.string(),
   
  });

  const handleUpload = async (values) => {
    setInitialLoading(true);
    try {
      const formData = buildForm(values);
      const res = await axios.post(
        `/api/pay/razorpay/genCertificate?formId=clapfeedback&uuid=${query.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.push(`/certificates/${query.id}.pdf`);
      // router.push(`/feedback/feedback/${res.data.id}`);
    } catch (err) {
      setError(true);
      setErrorMsg(err.response !== undefined ? err.response.data.error : err);
      setInitialLoading(false);
    }
  };

  return (
    <div className={styles.container} style={{ height: "100%" }}>
      <Head>
        <title>Feedback</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {initialLoading ? (
        <div
          className={styles.eventform}
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader msg="Don't refresh this page. Redirecting to payment processing service ..." />
        </div>
      ) : (
        <main className={styles.main}>
          <>
            <div className={styles.eventdetails_con}>
              {/* <img src={"./banner.jpeg"} className={styles.image} alt="BANNER" /> */}
              <div className={styles.eventdetails_con_circle}></div>
              <div className={styles.eventdetails_con_circle}></div>
              <div className={styles.eventdetails_con_circle}></div>

              <div className={styles.eventdetails}>
                {/* <p className={styles.eventdetails_dnt} >REGISTRATION FORM</p> */}
                <h3 className={styles.eventdetails_title}>Feedback</h3>
              </div>
            </div>
            <div className={styles.eventform}>
              {error ? <Error setError={setError} msg={errorMsg} /> : null}

              {loading ? (
                <>
                  <Loader msg="Don't refresh this page. Redirecting to payment processing service ..." />
                </>
              ) : (
                <div className={styles.eventform_con}>
                  <Formik
                    initialValues={user}
                    validationSchema={schema}
                    onSubmit={(values) => {
                      handleUpload(values);
                    }}
                  >
                    {({ values, setFieldValue, handleSubmit, errors }) => (
                      <>
                        <Input3
                          label="Enter your name as it should in the certificate *"
                          value={values.name}
                          onChange={(e) =>
                            setFieldValue("name", e.target.value)
                          }
                          placeholder="Enter your name "
                          errors={
                            getIn(errors, "name") !== undefined
                              ? getIn(errors, "name")
                              : ""
                          }
                        />
                        <Input3
                          label="Enter your registered email *"
                          value={values.email}
                          onChange={(e) =>
                            setFieldValue("email", e.target.value)
                          }
                          placeholder="Enter your registered email *"
                          errors={
                            getIn(errors, "email") !== undefined
                              ? getIn(errors, "email")
                              : ""
                          }
                        />
                         <Rating
                          event="Welcome and Opening Remarks"
                          setFieldValue={setFieldValue}
                          name1="session1"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Resume Building by Michele Ross"
                          setFieldValue={setFieldValue}
                          name1="session2"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Interview Training, Elevator Pitch & Personal Branding by Dr. A. S. Abdurrasheed"
                          setFieldValue={setFieldValue}
                          name1="session3"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Entrepreneurship by Jan Wong"
                          setFieldValue={setFieldValue}
                          name1="session4"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the Panel Discussion on Opportunities and Skills needed in Industry"
                          setFieldValue={setFieldValue}
                          name1="session5"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Leadership Training by Almeer Ahsan Asif"
                          setFieldValue={setFieldValue}
                          name1="session6"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Leadership in the era of Technology Disruption' by Latha Chembrakalam"
                          setFieldValue={setFieldValue}
                          name1="session7"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Team Building and Networking Session"
                          setFieldValue={setFieldValue}
                          name1="session8"
                          values={values}
                          errors={errors}
                        />
                         <Rating
                          event="Welcome & Opening Address of Day 02"
                          setFieldValue={setFieldValue}
                          name1="session9"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Effective Research Strategies by Dr. Sambit Bakshi"
                          setFieldValue={setFieldValue}
                          name1="session10"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Skills to Pursue a Career in Academia by Dr. Sasha Nikolic"
                          setFieldValue={setFieldValue}
                          name1="session11"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="panel discussion on Opportunities in Academia"
                          setFieldValue={setFieldValue}
                          name1="session12"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Aligning Your Career with IEEE by David Koehler"
                          setFieldValue={setFieldValue}
                          name1="session13"
                          values={values}
                          errors={errors}
                        />
                       

                        <TextArea2
                          label={`General comments`}
                          value={values.suggestions}
                          onChange={(e) =>
                            setFieldValue("suggestions", e.target.value)
                          }
                          placeholder="Write your feedback here"
                          errors={
                            getIn(errors, "suggestions") !== undefined
                              ? getIn(errors, "suggestions")
                              : ""
                          }
                        />
                       
                        {/* {JSON.stringify(errors, 2, null)} */}
                        <button
                          className={styles.button}
                          onClick={handleSubmit}
                        >
                          SUBMIT
                        </button>
                      </>
                    )}
                  </Formik>

                  <footer className={styles.footer}>
                    <p>
                      This content is created by the owner of the form. The data
                      you submit will be sent to the form owner. IEEE Kerala
                      Section is not responsible for the privacy or security
                      practices of its customers, including those of this form
                      owner. Never give out your password.
                    </p>
                    <br />
                    Powered by IKS Mint Forms |{" "}
                    <a
                      style={{ color: "blue" }}
                      href="https://ieee-mint.org/privacy"
                    >
                      Privacy and cookies
                    </a>{" "}
                    |{" "}
                    <a
                      style={{ color: "blue" }}
                      href="https://ieee-mint.org/terms"
                    >
                      Terms of use
                    </a>
                  </footer>
                </div>
              )}
            </div>
          </>
        </main>
      )}
    </div>
  );
}
