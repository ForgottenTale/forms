import styles from './Styles.module.css'
import DisabledInput from '../disabledInput';

export default function UserDetails({ data, setShow }) {

    return (
        <div className={styles.userDetails} >
            <div className={styles.userDetails_overlay} onClick={() => setShow(false)}>

            </div>
            <div className={styles.userDetails_con} >
                <DisabledInput label="Order Id" value={data.orderId} />
                <DisabledInput label="Name" value={data.firstName !== undefined ? data.firstName + " " + data.lastName : data.name} />
                <DisabledInput label="Email" value={data.email} />
                <DisabledInput label="Phone" value={data.phone} />
                <DisabledInput label="Institute" value={data.institute} />
                <DisabledInput label="Membership Type" value={data.membershipType} />
                {data.gender!== undefined ? <DisabledInput label="Gender" value={data.gender} /> : null}
                {data.branch !== undefined ? <DisabledInput label="Branch" value={data.branch} /> : null}
                {data.CGPA !== undefined ? <DisabledInput label="CGPA" value={data.CGPA} /> : null}
                {data.yearofPassout !== undefined ? <DisabledInput label="Passout Year" value={data.yearofPassout} /> : null}
                {data.paymentStatus !== undefined ? <DisabledInput label="Payment Status" value={data.paymentStatus} /> : null}
                {data.backlog !== undefined ? <DisabledInput label="Backlogs" value={data.backlog} /> : null}
                {data.fileUpload !== undefined ? <div onClick={() => window.open(`/${data.fileUpload}`)}>
                    <DisabledInput label="Resume Link" value={data.fileUpload} />
                </div> : null}
                {data.gender!== undefined ? <DisabledInput label="Gender" value={data.gender} /> : null}
                {data.role!== undefined ? <DisabledInput label="Role" value={data.role} /> : null}
                {data.location!== undefined ? <DisabledInput label="Resume Link" value={data.location} /> : null}
                {data.accommodation!== undefined ? <DisabledInput label="DO YOU REQUIRE ACCOMMODATION PRIOR OR AFTER THE EVENT ?" value={data.accommodation} /> : null}
                {data.location!== undefined ? <DisabledInput label="Location" value={data.location} /> : null}
                {data.amount!== undefined ? <DisabledInput label="Amount Paid" value={JSON.parse(data.amount).amount} /> : null}

            </div>
        </div>
    )
}