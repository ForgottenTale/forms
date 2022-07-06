
import styles from './Styles.module.css'
import Input from '../CustomInput/input3';
import SendIcon from '../../icons/send';
import TextArea from '../textArea';
import Error from '../error';
import Notification from '../notification';
import axios from 'axios';
import Loader from '../loader';
import { useState } from 'react';

export default function Mail({ setShowMail, data }) {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [fillMsg, setFillMsg] = useState(false);
    const [once, setOnce] = useState(false);
    const [notificationMsg, setNotificationMsg] = useState(false);
    const [notification, setNotification] = useState(false);
    const [loader, setLoader] = useState(false);

    const [content, setContent] = useState({
        to: data.map((val) => val.email).toString(),
        subject: "",
        msg: ""
    })

    const handleSubmit = async () => {
        setLoader(true);
        try {
            if (content.subject !== "" && content.subject !== "" && !once) {
                setOnce(true)
                await axios.post("/api/form/mail", content)
                console.log(content)
                setNotificationMsg("Mail send")
                setNotification(true);
                setTimeout(() => setShowMail(false), 5000)

            }
            else {
                setFillMsg(true);

            }
        }
        catch (err) {
            setError(true);
            setLoader(false);
            setErrorMsg(err.response !== undefined ? err.response.data.error : err)
        }

    }
    return (
        <div className={styles.mail}>
            <div className={styles.modal_overlay} onClick={() => setShowMail(false)}>

            </div>
            {notification ? <Notification msg={notificationMsg} setNotify={setNotification} /> : null}
            {error ? <Error setError={setError} msg={errorMsg} /> : null}
            {loader ? <Loader /> : <div className={styles.mail_con}>

                <Input label="To" value={content.to} onChange={(e) => { setFillMsg(false); setContent(prevState => { return { ...prevState, to: e.target.value } }) }} />
                <Input label="Subject" onChange={(e) => { setFillMsg(false); setContent(prevState => { return { ...prevState, subject: e.target.value } }) }} />
                <TextArea label="Message" onChange={(e) => { setFillMsg(false); setContent(prevState => { return { ...prevState, msg: e.target.value } }) }} />
                {fillMsg ? <p style={{ color: "red", fontSize: "12px" }}>Subject and Message are required</p> : null}
                <div className={styles.responses_buttons}>
                    <div className={styles.responses_button} style={{ marginLeft: 0 }} onClick={handleSubmit}><SendIcon /><p>Send mail</p></div>
                    <div className={styles.responses_button} onClick={() => setShowMail(false)}>Cancel</div>
                </div>
            </div>}


        </div>
    )
}