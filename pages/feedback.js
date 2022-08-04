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

function Rating({ event, name1, name2, values, errors, setFieldValue }) {
  return (
    <>
      <EmojiSelector
        event={`${event} *`}
        onClick={(e) => setFieldValue(name1, e)}
        value={values[name1]}
        errors={getIn(errors, name1) !== undefined ? getIn(errors, name1) : ""}
      />
      <TextArea2
        label={`Share your thoughts about ${event}`}
        value={values[name2]}
        onChange={(e) => setFieldValue(name2, e.target.value)}
        placeholder="Write your feedback here"
        errors={getIn(errors, name2) !== undefined ? getIn(errors, name2) : ""}
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
  const [certificate, setCertificate] = useState(false);
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
        router.push(`/pdf/${res.data.id}.pdf`);
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
  }, [certificate, query.id]);

  const user = {
    name: "",
    email: "",
    session1: "",
    session1Des: "",
    session2: "",
    session2Des: "",
    session3: "",
    session3Des: "",
    session4: "",
    session4Des: "",
    session5: "",
    session5Des: "",
    session6: "",
    session6Des: "",
    session7: "",
    session7Des: "",
    session8: "",
    session8Des: "",
    session9: "",
    session9Des: "",
    session10: "",
    session10Des: "",
    session11: "",
    session11Des: "",
    session12: "",
    session12Des: "",
    session13: "",
    session13Des: "",
    session14: "",
    session14Des: "",
    session15: "",
    session15Des: "",
    session16: "",
    session16Des: "",
    session17: "",
    session17Des: "",
    session18: "",
    session18Des: "",
    session19: "",
    session19Des: "",
    session20: "",
    session20Des: "",
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
    session1: yup.string().required(),
    session1Des: yup.string(),
    session2: yup.string().required(),
    session2Des: yup.string(),
    session3: yup.string().required(),
    session3Des: yup.string(),
    session4: yup.string().required(),
    session4Des: yup.string(),
    session5: yup.string().required(),
    session5Des: yup.string(),
    session6: yup.string().required(),
    session6Des: yup.string(),
    session7: yup.string().required(),
    session7Des: yup.string(),
    session8: yup.string().required(),
    session8Des: yup.string(),
    session9: yup.string().required(),
    session9Des: yup.string(),
    session10: yup.string().required(),
    session10Des: yup.string(),
    session11: yup.string().required(),
    session11Des: yup.string(),
    session12: yup.string().required(),
    session12Des: yup.string(),
    session13: yup.string().required(),
    session13Des: yup.string(),
    session14: yup.string().required(),
    session14Des: yup.string(),
    session15: yup.string().required(),
    session15Des: yup.string(),
    session16: yup.string().required(),
    session16Des: yup.string(),
    session17: yup.string().required(),
    session17Des: yup.string(),
    session18: yup.string().required(),
    session18Des: yup.string(),
    session19: yup.string().required(),
    session19Des: yup.string(),
    session20: yup.string().required(),
    session20Des: yup.string(),

  });

  const handleUpload = async (values) => {
    setLoading(true);
    try {
      const formData = buildForm(values);
      const res = await axios.post(
        `/api/pay/razorpay/genCertificate?formId=feedback`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.push(`/pdf/${values.email}.pdf`);
      // router.push(`/feedback/feedback/${res.data.id}`);
    } catch (err) {
      setError(true);
      setErrorMsg(err.response !== undefined ? err.response.data.error : err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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
                          event="Session 1: Plenary talk by Anna Ferrer"
                          setFieldValue={setFieldValue}
                          name1="session1"
                          name2="session1Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 2: 'Challenges faced by Women in Mission-Mode Project' by Dr. Rameetha K"
                          setFieldValue={setFieldValue}
                          name1="session2"
                          name2="session2Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 3: 'Leadership and Empowerment' by Madhavikutty MS IAS"
                          setFieldValue={setFieldValue}
                          name1="session3"
                          name2="session3Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 4: 'Health and Well-being' by Lakshmikutty Amma"
                          setFieldValue={setFieldValue}
                          name1="session4"
                          name2="session4Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 5: Panel discussion on : 'Towards a diverse, equitable and inclusive society'"
                          setFieldValue={setFieldValue}
                          name1="session5"
                          name2="session5Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 6: 'Leadership in the era of Technology Disruption' by Latha Chembrakalam"
                          setFieldValue={setFieldValue}
                          name1="session6"
                          name2="session6Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 7: 'Legal rights of women at workplace' by Nidhiya Jayaraman"
                          setFieldValue={setFieldValue}
                          name1="session7"
                          name2="session7Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 8: 'Technology for Humanity' by Sampath Kumar Veeraraghavan"
                          setFieldValue={setFieldValue}
                          name1="session8"
                          name2="session8Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 9: 'Technology for humanity' by Vani Murthy"
                          setFieldValue={setFieldValue}
                          name1="session9"
                          name2="session9Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 10: 'Career and Entrepreneurship' by Swapna Augustine"
                          setFieldValue={setFieldValue}
                          name1="session10"
                          name2="session10Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 11: 'Career and Entrepreneurship' by Priyanka Chandran"
                          setFieldValue={setFieldValue}
                          name1="session11"
                          name2="session11Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 12: 'Leadership and Empowerment-Artists perspective' by Dr. Methil Devika"
                          setFieldValue={setFieldValue}
                          name1="session12"
                          name2="session12Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 13: 'Innovation and Women Empowerment' by Dr. Bindu Nair"
                          setFieldValue={setFieldValue}
                          name1="session13"
                          name2="session13Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 14: Panel discussion on 'Sustainable power for Industry 4.0 and Agriculture 2025'"
                          setFieldValue={setFieldValue}
                          name1="session14"
                          name2="session14Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 15: 'How WIE helps professional growth for academia and industry' by Ramalatha Marimuthu"
                          setFieldValue={setFieldValue}
                          name1="session15"
                          name2="session15Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 16: 'Health and Well-being' by Dr. Lalitha Appukuttan"
                          setFieldValue={setFieldValue}
                          name1="session16"
                          name2="session16Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="Session 17 : 'Indian Yoga' by Mrs Vinny Shankar"
                          setFieldValue={setFieldValue}
                          name1="session17"
                          name2="session17Des"
                          values={values}
                          errors={errors}
                        />
                        <Rating
                          event="the residential programme"
                          setFieldValue={setFieldValue}
                          name1="session18"
                          name2="session18Des"
                          values={values}
                          errors={errors}
                        />

                        <Rating
                          event="general arrangements"
                          setFieldValue={setFieldValue}
                          name1="session19"
                          name2="session19Des"
                          values={values}
                          errors={errors}
                        />
                          <Rating
                          event="the overall programme"
                          setFieldValue={setFieldValue}
                          name1="session20"
                          name2="session20Des"
                          values={values}
                          errors={errors}
                        />
                        <Input3
                          label="Are you interested in associating with IEEE WIE *"
                          value={values.join}
                          onChange={(e) =>
                            setFieldValue("join", e.target.value)
                          }
                          placeholder="Are you interested in associating with IEEE WIE"
                          errors={
                            getIn(errors, "join") !== undefined
                              ? getIn(errors, "join")
                              : ""
                          }
                        />
                        <Input3
                          label="Are you interested in comming to the next IEEE WIEILS *"
                          value={values.nextWie}
                          onChange={(e) =>
                            setFieldValue("nextWie", e.target.value)
                          }
                          placeholder="Are you interested in comming to the next IEEE WIEILS"
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
