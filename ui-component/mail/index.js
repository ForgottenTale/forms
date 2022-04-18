
import styles from './Styles.module.css'
import Input from '../input';
import SendIcon from '../../icons/send';
import TextArea from '../textArea';
import DisabledInput from '../disabledInput';
import Error from '../error';
import axios from 'axios';
import { useState } from 'react';

export default function Mail({ setShowMail }) {
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [fillMsg, setFillMsg] = useState(false);
    const [once, setOnce] = useState(false);


    const [content, setContent] = useState({
        to: "all",
        subject: "",
        msg: ""
    })

    const handleSubmit = async () => {

        try {
            if (content.subject !== "" && content.subject !== ""&&!once) {
                setOnce(true)
                await axios.post("/api/form/mail?to=success", content)
                console.log(content)
                setErrorMsg("Mail send")
                setError(true)
                setTimeout(()=>setShowMail(false), 5000)
                // setOnce(false)
                // setShowMail(false)

            }
            else {
                setFillMsg(true);

            }
        }
        catch (err) {
            setError(true)
            setErrorMsg(err.response !== undefined ? err.response.data.error : err)
        }

    }
    return (
        <div className={styles.mail}>

            {error ? <Error setError={setError} msg={errorMsg} /> : null}
            <div className={styles.mail_con}>

                <DisabledInput label="To" value="To those who have successfully completed the payment" />
                <Input label="Subject" onChange={(e) => { setFillMsg(false); setContent(prevState => { return { ...prevState, subject: e.target.value } }) }} />
                <TextArea label="Message" onChange={(e) => { setFillMsg(false); setContent(prevState => { return { ...prevState, msg: e.target.value } }) }} />
                {fillMsg ? <p style={{ color: "red", fontSize: "12px" }}>Subject and Message are required</p> : null}
                <div className={styles.responses_buttons}>
                    <div className={styles.responses_button} style={{ marginLeft: 0 }} onClick={handleSubmit}><SendIcon /><p>Send mail</p></div>
                    <div className={styles.responses_button} onClick={() => setShowMail(false)}>Cancel</div>
                </div>
            </div>


        </div>
    )
}