const express = require('express')
const Applicant = require('../../models/applicant');
const logger = require('../../utils/logger');
const router = express.Router();
const sendMail = require('./sendMail');
const pendingTemplate = require('../../mailTemplates/registerPending');
const Form = require('../../models/forms');
const generateRandomString = require('../../utils/generateRandomString');


router.get("/responses", async (req, res) => {

    try {
        // const applicants = await Applicant.find({})
        const responses = await Form.findOne({ formId: req.query.formId })
        res.send(responses)
    }
    catch (err) {
        logger.error(err);
        res.status(400).send({ error: err.message })
    }

})

router.post("/mail", async (req, res) => {

    try {
        const param = req.query.to = "success" ? { paymentStatus: "success" } : req.query.to = "pending" ? { paymentStatus: "Pending" } : { paymentStatus: "failed" }
        const applicants = await Applicant.find(param)
        applicants.forEach((applicant) => {
            sendMail(applicant.email, req.body.subject, req.body.msg)
        })

        res.sendStatus(200)
    }
    catch (err) {
        logger.error(err);
        res.status(400).send({ error: err.message })
    }


})
router.delete("/response", async (req, res) => {
    try {
        await Form.updateOne({ formId: req.query.formId }, {
            $pull: { responses: { responseId: req.query.responseId } }
        })
        res.sendStatus(201)
    }
    catch (err) {
        logger.error(err);
        res.status(400).send({ error: err.message })
    }
})

router.post("/mail/reminder", async (req, res) => {

    try {
        const response = await Form.findOne({ formId: req.query.formId })
        response.responses.forEach((applicant) => {
            if (applicant.paymentStatus === "pending") {
                sendMail(applicant.email,
                    `${response.title} | Registration pending`,
                    pendingTemplate(
                        {
                            name: applicant.name,
                            orderId: applicant.orderId,
                            amount: JSON.parse(applicant.amount).amount * 100,
                            paymentStatus: "pending",
                            txnDate: applicant.timeStamp !== undefined ? applicant.timeStamp : new Date(),
                            email: applicant.email,
                            phone: applicant.phone,
                            banner: process.env.NODE_ENV === "development" ? `http://localhost:3000/form%20banners/${response.banner}` : `https://forms.ieee-mint.org/form%20banners/${response.banner}`,
                            title: response.title,
                            venue: response.venue,
                            eventDate: response.eventDate,
                            formId: response.formId
                        }
                    )
                )
            }

        })


        res.sendStatus(200);
    }
    catch (err) {
        logger.error(err);
        res.status(400).send({ error: err.message })
    }

})


router.get("/jobfairUpdate", async (req, res) => {
    try {
        const response = await Applicant.find({}, { _id: false, __v: false })
        const updated = []
        response.map((e) => {

            updated.push({
                name: e.firstName + " " + e.lastName,
                responseId: generateRandomString(10),
                membershipType: e.ieeeMember ? "IEEE Member" : "Non IEEE Member",
                ...e._doc
            })
        })
        await Form.updateOne({ formId: "jobfair" }, { responses: updated })
        res.send(updated)
    }
    catch (err) {
        logger.error(err);
        res.status(400).send({ error: err.message })
    }
})

router.get("/pricing", async (req, res) => {
    try {
        const response = await Form.findOne({ formId: req.query.formId })
        res.send({
            pricing: response.pricing,
            members: response.members,
            specific: response.specific
        })

    } catch (err) {
        logger.error(err);
        res.status(400).send({ error: err.message })
    }

})

router.post("/test", async (req, res) => {
    try {

        const response = await Form.findOneAndUpdate({ formId: "wlc" }, {
            pricing: req.body
        })
        response.save()
            .then(() => res.send(response))
            .catch((err) => {
                logger.error(err)
                res.status(400).send({ error: err.message })
            })

    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }

})
router.post("/member", async (req, res) => {
    console.log(req.body.data)
    try {

        const response = await Form.findOneAndUpdate({ formId: "wlc" }, {
            members: req.body.data
        })
        response.save()
            .then(() => res.send(response))
            .catch((err) => {
                logger.error(err)
                res.status(400).send({ error: err.message })
            })

    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }

})

module.exports = router