

import axios from 'axios';
import { useEffect, useState } from 'react';
import Error from '../../ui-component/error';
import Input from '../../ui-component/search';
import Loader from '../../ui-component/loader';
// import { useParams } from 'react-router-dom';
import UserDetails from '../../ui-component/userDetail';
import SendIcon from '../../icons/send';
import DownloadIcon from '../../icons/download';
import styles from '../../styles/Responses.module.css'
import Mail from '../../ui-component/mail'
import { useRouter } from 'next/router';
import DeleteIcon from '../../icons/delete';
import Modal from '../../ui-component/modal'
import ViewIcon from '../../icons/view';

export default function Responses() {
    const [errorMsg, setErrorMsg] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [showMail, setShowMail] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [applicant, setApplicant] = useState({});
    const header = ["OrderId", "Name", "Email", "Phone", "Institute", "Membership Type", "Amount", "Payment Status", "Action"];
    // const { formId } = useParams();
    const router = useRouter();
    const formId = router.query.formId

    useEffect(() => {

        async function getData() {
            setLoading(true);
            try {
                const res = await axios.get(`/api/form/responses?formId=${formId}`)
                console.log(res.data.responses)
                setLoading(false);
                setData(res.data.responses);
            }
            catch (err) {
                setError(true)
                setErrorMsg(err.response !== undefined ? err.response.data.error : err)

            }
        }
        if (formId !== undefined) {
            getData()

        }
    }, [formId])

    const createCsv = () => {
        const headers = ["OrderId", "Name", "Email", "Phone", "Institute", "Backlog", "Branch", "CGPA", "Year of graduation", "IEEE Member", "Membership Id", "Amount", "Payment Status", "Resume"];
        const rows = [headers];

        data.forEach((val) => {
            rows.push([
                val.orderId, val.firstName + " " + val.lastName, val.email, val.phone, String(val.institute), val.backlog, val.branch, val.CGPA, val.yearofPassout, val.ieeeMember ? "Yes" : "No", val.membershipId, val.amount, val.paymentStatus, `https://forms.ieee-mint.org/${val.resume}`
            ])
        })

        let csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");


        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }
    const sendNotification = async () => {
        try {
            await axios.post("/api/form/mail/reminder")
            setError(true)
            setErrorMsg("Payment notification mail send")
        }
        catch (err) {
            setError(true)
            setErrorMsg(err.response !== undefined ? err.response.data.error : err)
        }

    }

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/form/response?responseId=${deleteId}&formId=${formId}`)
            setModal(false)

        }
        catch (err) {
            setError(true)
            setErrorMsg(err.response !== undefined ? err.response.data.error : err)
        }

    }


    return (
        <div className={styles.responses}>
            {showMail ? <Mail setShowMail={setShowMail} /> : null}
            {show ? <UserDetails data={applicant} setShow={setShow} /> : null}
            {error ? <Error setError={setError} msg={errorMsg} /> : null}
            {modal ? <Modal setModal={setModal} title="Are you sure to delete this response" handleSubmit={handleDelete} /> : null}
            {
                loading ? <Loader msg="Loading data" /> :
                    <div>
                        <h3>Responses</h3>
                        <p>Total responses : {data.length}</p>
                        <p>Success : {data.filter((e) => e.paymentStatus === "success").length} Pending : {data.filter((e) => e.paymentStatus === "Pending").length} Failed : {data.filter((e) => e.paymentStatus === "failed").length}</p>

                        <div className={styles.responses_tools}>
                            <Input onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for users, email address..." />
                            <div className={styles.responses_buttons}>
                                <div className={styles.responses_button} onClick={() => sendNotification()}><SendIcon /><p className={styles.responses_p}>Send notification</p></div>
                                <div className={styles.responses_button} onClick={() => setShowMail(true)}><SendIcon /><p className={styles.responses_p}>Send mail</p></div>
                                <div className={styles.responses_button} onClick={() => createCsv()}><DownloadIcon /><p className={styles.responses_p}>Download CSV</p></div>
                            </div>

                        </div>
                        <div className={styles.table}>
                            <div className={styles.table_row}>
                                {header.map((val, key) => <div key={key} className={styles.table_header}>
                                    {val}
                                </div>)}
                            </div>
                            {data.filter((n) => {
                                if (`${n.firstName + " " + n.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
                                    || n.email.toLowerCase().includes(searchTerm.toLowerCase())
                                    || n.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
                                    || n.orderId.includes(searchTerm.toLowerCase())) {
                                    return n;
                                } else {
                                    return null;
                                }
                            })

                                .map((val, key) => <div key={key} className={styles.table_row} >
                                    <div className={styles.table_item}>{val.orderId}</div>
                                    <div className={styles.table_item}>{val.firstName !== undefined ? val.firstName + " " + val.lastName : val.name}</div>
                                    <div className={styles.table_item}>{val.email}</div>
                                    <div className={styles.table_item}>{val.phone}</div>
                                    <div className={styles.table_item}>{val.institute}</div>
                                    {/* <div className={styles.table_item}>{val.branch}</div> */}
                                    {/* <div className={styles.table_item}>{val.CGPA}</div> */}
                                    {/* <div className={styles.table_item}>{val.yearofPassout}</div> */}
                                    <div className={styles.table_item}>{val.membershipType}</div>
                                    <div className={styles.table_item}>{val.amount}</div>
                                    <div className={styles.table_item}>{val.paymentStatus}</div>
                                    <div className={styles.table_item}>
                                        <div className={styles.table_icon}>
                                            <div className={styles.table_icon_container} onClick={() => { setApplicant(val); setShow(true) }}>
                                                <ViewIcon />
                                            </div>
                                        </div>
                                        <div className={styles.table_icon} onClick={() => { setDeleteId(val.responseId);  setModal(true) }}>
                                            <div className={styles.table_icon_container}>
                                                <DeleteIcon />
                                            </div>
                                        </div>

                                    </div>

                                </div>)}

                        </div>
                    </div>
            }
        </div>
    );
}