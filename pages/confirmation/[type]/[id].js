import Head from 'next/head'
import Error from '../../../ui-component/error';
import Loader from '../../../ui-component/loader';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import styles from '../../../styles/Confirmation.module.css';

export default function Confirmation() {

    const router = useRouter()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [data, setData] = useState({})


    useEffect(async () => {
        if (router.query.id !== undefined) {
            try {
                const res = await axios.get(`/api/pay/confirmation?orderId=${router.query.id}&formId=${router.query.type}`);
                console.log(res.data)
                setLoading(false);
                setData(res.data)
            }
            catch (err) {
                setError(true)
                setErrorMsg(err.response !== undefined ? err.response.data.error : String(err))
                // setLoading(false);
            }
        }

    }, [router.query.id,router.query.type])

    return (
        <main className="main">
            <Head>
                <title>Job Fair 2022</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.eventform} >
                {error ? <Error setError={setError} msg={errorMsg} /> : null}
                {loading ?
                    <Loader msg="Loading receipt details" /> :
                    <div className={styles.eventform_con}>
                        <div className={styles.eventdetails}>
                            <p className={styles.eventdetails_dnt}>Event Registration Confirmation</p>
                            <h3 className={styles.eventdetails_title}>{data.title}</h3>
                            {data.responses!== undefined && data.responses[0].paymentStatus === "success" ? <p className={styles.eventdetails_des}>Thank you for registering for the event. A copy of the receipt has been sent to your registered email</p> :
                                <p className={styles.eventdetails_des}>{data.responses!== undefined && data.responses[0].paymentStatus !== "failed" ? "The payment is yet to be recieved" : "The transaction has failed"}</p>
                            }
                            {/* <p className={styles.confirm}></p> */}
                        </div>
                        <div className={styles.paymentDetails}>
                            <p className={styles.paymentDetails_title}>Payment Details</p>
                           {data.responses!==undefined? <div className={styles.paymentDetails_grid}>
                                {data.responses[0].orderId !== undefined ?
                                    <><p>Order Id</p> <p>{data.responses[0].orderId}</p></> : null}
                                {data.responses[0].txnId !== undefined ?
                                    <><p >Transaction Id</p> <p className={styles.txn}>{data.responses[0].txnId}</p></> : null}
                                {data.responses[0].paymentStatus !== undefined ?
                                    <><p>Payment Status</p> <p className={styles[data.responses[0].paymentStatus]}>{data.responses[0].paymentStatus}</p></> : null}
                                {data.responses[0].amount !== undefined ?
                                    <><p>Amount</p> <p>{data.responses[0].amount}</p></> : null}
                                {data.responses[0].txnDate !== undefined ?
                                    <><p>Date</p> <p>{new Date(data.responses[0].txnDate).toLocaleDateString()} {new Date(data.responses[0].txnDate).toLocaleTimeString()}</p></> : null}
                            </div>:null}
                        </div>
                        <div className={styles.paymentDetails}>
                            <p className={styles.paymentDetails_title}>Event Details</p>
                            <div className={styles.paymentDetails_grid}>
                                <p>Date and Time</p> <p>{new Date(data.eventDate).toLocaleString()}</p>
                                <p>Venue</p> <p>{data.venue}</p>
                                {/* <p>Amount</p> <p>Rs 10.00</p>
                                <p>Date</p> <p>12th Mar 2022 11:00 PM IST</p> */}

                            </div>

                        </div>

                        <div className={styles.buttons}>
                            <button className={styles.button} onClick={() => window.print()}>Print</button>
                            <button className={styles.button} onClick={() => router.push(`/${router.query.type}`)}>Submit another</button>
                        </div>
                    </div>
                }

            </div>

        </main>

    );
}