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
        `/api/form/certiCheck?id=${query.id}&formId=feedback`
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
    session14: "",
    session15: "",
    session16: "",
    session17: "",
    session18: "",
    session19: "",
    session20: "",
    suggestions: "",
    logistics: "",
    accomodation: "",
    join: "",
    nextWie: "",
  };
  // const user = {
  //   name: "Abhijith Kannan",
  //   email: "abhijithkannan452@gmail.com",
  //   session1: "fsduhiuhsiduhfishd",
  //   session1Des: "fsduhiuhsiduhfishd",
  //   session2: "fsduhiuhsiduhfishd",
  //   session2Des: "fsduhiuhsiduhfishd",
  //   session3: "fsduhiuhsiduhfishd",
  //   session3Des: "fsduhiuhsiduhfishd",
  //   session4: "fsduhiuhsiduhfishd",
  //   session4Des: "fsduhiuhsiduhfishd",
  //   session5: "fsduhiuhsiduhfishd",
  //   session5Des: "fsduhiuhsiduhfishd",
  //   session6: "fsduhiuhsiduhfishd",
  //   session6Des: "fsduhiuhsiduhfishd",
  //   session7: "fsduhiuhsiduhfishd",
  //   session7Des: "fsduhiuhsiduhfishd",
  //   session8: "fsduhiuhsiduhfishd",
  //   session8Des: "fsduhiuhsiduhfishd",
  //   session9: "fsduhiuhsiduhfishd",
  //   session9Des: "fsduhiuhsiduhfishd",
  //   session10: "fsduhiuhsiduhfishd",
  //   session10Des: "fsduhiuhsiduhfishd",
  //   session11: "fsduhiuhsiduhfishd",
  //   session11Des: "fsduhiuhsiduhfishd",
  //   session12: "fsduhiuhsiduhfishd",
  //   session12Des: "fsduhiuhsiduhfishd",
  //   session13: "fsduhiuhsiduhfishd",
  //   session13Des: "fsduhiuhsiduhfishd",
  //   session14: "fsduhiuhsiduhfishd",
  //   session14Des: "fsduhiuhsiduhfishd",
  //   session15: "fsduhiuhsiduhfishd",
  //   session15Des: "fsduhiuhsiduhfishd",
  //   session16: "fsduhiuhsiduhfishd",
  //   session16Des: "fsduhiuhsiduhfishd",
  //   session17: "fsduhiuhsiduhfishd",
  //   session17Des: "fsduhiuhsiduhfishd",
  //   session18: "fsduhiuhsiduhfishd",
  //   session18Des: "fsduhiuhsiduhfishd",
  //   session19: "fsduhiuhsiduhfishd",
  //   session19Des: "fsduhiuhsiduhfishd",
  //   session20: "fsduhiuhsiduhfishd",
  //   session20Des: "fsduhiuhsiduhfishd",
  //   join: "fsduhiuhsiduhfishd",
  //   nextWie: "fsduhiuhsiduhfishd",
  // };

  let schema = yup.object().shape({
    email: yup.string().email().required("Required"),
    name: yup.string().required("Required"),
    nextWie: yup.string().required("Required"),
    join: yup.string().required("Required"),
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
    session14: yup.string().required("Required"),
    session15: yup.string().required("Required"),
    session16: yup.string().required("Required"),
    session17: yup.string().required("Required"),
    session18: yup.string().required("Required"),
    session19: yup.string().required("Required"),
    session20: yup.string().required("Required"),
    suggestions: yup.string(),
    logistics: yup.string(),
    accomodation: yup.string()
  });

  const handleUpload = async (values) => {
    setInitialLoading(true);
    try {
      const formData = buildForm(values);
      const res = await axios.post(
        `/api/pay/razorpay/genCertificate?formId=feedback&uuid=${query.id}`,
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
                          event="the session on Plenary talk by Anne Ferrer"
                          setFieldValue={setFieldValue}
                          name1="session1"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Challenges faced by Women in Mission-Mode Project' by Dr. Rameetha K"
                          setFieldValue={setFieldValue}
                          name1="session2"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Leadership and Empowerment' by Madhavikutty MS IAS"
                          setFieldValue={setFieldValue}
                          name1="session3"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Health and Well-being' by Lakshmikutty Amma"
                          setFieldValue={setFieldValue}
                          name1="session4"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Panel discussion on : 'Towards a diverse, equitable and inclusive society'"
                          setFieldValue={setFieldValue}
                          name1="session5"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Leadership in the era of Technology Disruption' by Latha Chembrakalam"
                          setFieldValue={setFieldValue}
                          name1="session6"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Legal rights of women at workplace' by Nidhiya Jayaraman"
                          setFieldValue={setFieldValue}
                          name1="session7"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Technology for Humanity' by Sampath Kumar Veeraraghavan"
                          setFieldValue={setFieldValue}
                          name1="session8"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Technology for humanity' by Vani Murthy"
                          setFieldValue={setFieldValue}
                          name1="session9"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Career and Entrepreneurship' by Swapna Augustine"
                          setFieldValue={setFieldValue}
                          name1="session10"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Career and Entrepreneurship' by Priyanka Chandran"
                          setFieldValue={setFieldValue}
                          name1="session11"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Leadership and Empowerment-Artists perspective' by Dr. Methil Devika"
                          setFieldValue={setFieldValue}
                          name1="session12"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on 'Innovation and Women Empowerment' by Dr. Bindu Nair"
                          setFieldValue={setFieldValue}
                          name1="session13"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session on Panel discussion on 'Sustainable power for Industry 4.0 and Agriculture 2025'"
                          setFieldValue={setFieldValue}
                          name1="session14"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session 'How WIE helps professional growth for academia and industry' by Ramalatha Marimuthu"
                          setFieldValue={setFieldValue}
                          name1="session15"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the session 'Health and Well-being' by Dr. Lalitha Appukuttan"
                          setFieldValue={setFieldValue}
                          name1="session16"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="session on 'Ashtanga Yoga' by Vinny Shankar"
                          setFieldValue={setFieldValue}
                          name1="session17"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the residential programme"
                          setFieldValue={setFieldValue}
                          name1="session18"
                          values={values}
                          errors={errors}
                        />

                        <Rating
                          event="general arrangements"
                          setFieldValue={setFieldValue}
                          name1="session19"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the overall programme"
                          setFieldValue={setFieldValue}
                          name1="session20"
                          values={values}
                          errors={errors}
                        />
                        <TextArea2
                          label={`Suggestion about speakers and sessions`}
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
                        <TextArea2
                          label={`Your opinion on logistics of the program`}
                          value={values.logistics}
                          onChange={(e) =>
                            setFieldValue("logistics", e.target.value)
                          }
                          placeholder="Write your feedback here"
                          errors={
                            getIn(errors, "logistics") !== undefined
                              ? getIn(errors, "logistics")
                              : ""
                          }
                        />
                        <TextArea2
                          label={`Opinion on Venue and accomodation`}
                          value={values.accomodation}
                          onChange={(e) =>
                            setFieldValue("accomodation", e.target.value)
                          }
                          placeholder="Write your feedback here"
                          errors={
                            getIn(errors, "accomodation") !== undefined
                              ? getIn(errors, "accomodation")
                              : ""
                          }
                        />
                        <Input3
                          label="Are you interested in associating with IEEE WIE ?*"
                          value={values.join}
                          onChange={(e) =>
                            setFieldValue("join", e.target.value)
                          }
                          placeholder="Are you interested in associating with IEEE WIE ?"
                          errors={
                            getIn(errors, "join") !== undefined
                              ? getIn(errors, "join")
                              : ""
                          }
                        />
                        <Input3
                          label="Are you interested in attending the next  IEEE WIE ILS ? *"
                          value={values.nextWie}
                          onChange={(e) =>
                            setFieldValue("nextWie", e.target.value)
                          }
                          placeholder="Are you interested in attending the next  IEEE WIE ILS ?"
                          errors={
                            getIn(errors, "nextWie") !== undefined
                              ? getIn(errors, "nextWie")
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
