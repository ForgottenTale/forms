const success = require('../../../mailTemplates/registerSuccess');
const failed = require('../../../mailTemplates/registerFailed');
const pending = require('../../../mailTemplates/registerPending');

function content(status, data, applicant,formDetails) {

    if (status === "success") {
        return {
            from: process.env.NODE_ENV === "production" ? process.env.MAIL_USER : "graciela.keeling37@ethereal.email",
            to: process.env.NODE_ENV === "production" ? applicant.email : "graciela.keeling37@ethereal.email",
            subject: `${formDetails.title} | Registration Successful`,
            cc: "backup@ieeejobfair.com",
            html: success(
                {
                    name: applicant.name,
                    orderId: data.orderId,
                    amount: data.txnAmount,
                    paymentStatus: "success",
                    txnDate: data.txnDate,
                    txnId: data.txnId,
                    email: applicant.email,
                    phone: applicant.phone,
                    banner:process.env.NODE_ENV==="development"?`http://localhost:3000/form%20banners/${formDetails._doc.banner}`:`https://nextforms.ieee-mint.org/form%20banners/${formDetails._doc.banner}`,
                    title:formDetails.title,
                    venue:formDetails._doc.venue,
                    eventDate:formDetails._doc.eventDate
                }
            )

        }
    }

    else if (status === "pending") {

        return {
            from: process.env.NODE_ENV === "production" ? process.env.MAIL_USER : "graciela.keeling37@ethereal.email",
            to: process.env.NODE_ENV === "production" ? applicant.email : "graciela.keeling37@ethereal.email",
            subject: `${formDetails.title} | Registration pending`,
            cc: "backup@ieeejobfair.com",

            html: pending(
                {
                    name: applicant.name,
                    orderId: data.id,
                    amount: data.amount,
                    paymentStatus: "pending",
                    txnDate: data.created_at,
                    email: applicant.email,
                    phone: applicant.phone,
                    banner:process.env.NODE_ENV==="development"?`http://localhost:3000/form%20banners/${formDetails._doc.banner}`:`https://nextforms.ieee-mint.org/form%20banners/${formDetails._doc.banner}`,
                    title:formDetails.title,
                    venue:formDetails._doc.venue,
                    eventDate:formDetails._doc.eventDate
                }
            )
        }

    }
    else if (status === "failed") {
        return {
            from: process.env.NODE_ENV === "production" ? process.env.MAIL_USER : "graciela.keeling37@ethereal.email",
            to: process.env.NODE_ENV === "production" ? applicant.email : "graciela.keeling37@ethereal.email",
            subject: `${formDetails.title} | Registration failed`,
            cc: "backup@ieeejobfair.com",

            html: failed(
                {
                    name: applicant.name,
                    orderId: data.orderId,
                    amount: data.txnAmount,
                    paymentStatus: "failed",
                    txnDate: data.txnDate,
                    email: applicant.email,
                    phone: applicant.phone,
                    banner:process.env.NODE_ENV==="development"?`http://localhost:3000/form%20banners/${formDetails._doc.banner}`:`https://nextforms.ieee-mint.org/form%20banners/${formDetails._doc.banner}`,
                    title:formDetails.title,
                    venue:formDetails._doc.venue,
                    eventDate:formDetails._doc.eventDate
                }
            )
        }
    }

}

module.exports = content;