const moment = require('moment')
const express = require('express')
var crypto = require("crypto");
const Razorpay = require('razorpay');
const multer = require('multer');

const generateRandomString = require('../../../utils/generateRandomString');
const notify = require('../notify');
const Applicant = require('../../../models/applicant');
const Form = require('../../../models/forms');
const logger = require('../../../utils/logger');
const router = express.Router();

var instance = new Razorpay({
    key_id: process.env.razorPayId,
    key_secret: process.env.razorPaySecret,
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/files')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})

const upload = multer({ storage: fileStorage })

router.get("/orderDetails", async (req, res) => {
    try {
        const orderDetails = await instance.orders.fetch(req.query.orderId)
        const applicant = await Applicant.findOne({ orderId: req.query.orderId })
        logger.info(`> Reinitated payment for ${applicant.firstName + " " + applicant.lastName} orderId : ${req.query.orderId}`)
        orderDetails.key = process.env.razorPayId
        orderDetails.userDetails = {
            name: applicant.firstName + " " + applicant.lastName,
            email: applicant.email,
            phone: applicant.phone
        }
        res.send(orderDetails)
    }
    catch (err) {
        logger.error(err)
        res.status(400).send({ error: err.message })
    }

})

router.post("/verify", async (req, res) => {
    try {
        let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
        var expectedSignature = crypto.createHmac('sha256', process.env.razorPaySecret)
            .update(body.toString())
            .digest('hex');

        const orderDetails = await instance.orders.fetch(req.body.razorpay_order_id)
        if (expectedSignature === req.body.razorpay_signature) {
            const response = await Form.findOneAndUpdate({ formId: req.query.formId, "responses.orderId": req.query.orderId }, {
                $set: {
                    "responses.$.paymentStatus": "success",
                    "responses.$.txnDate": moment.unix(orderDetails.created_at).toISOString(),
                    "responses.$.txnId": req.body.razorpay_payment_id,
                }
            })
            var data = {
                txnAmount: orderDetails.amount_paid,
                orderId: req.body.razorpay_order_id,
                txnDate: moment.unix(orderDetails.created_at).toISOString(),
                txnId: req.body.razorpay_payment_id,
            }
            // console.log(response)
            const formDetails = await Form.findOne({ formId: req.query.formId })
            notify("success", data, response.responses[0], formDetails);
            response.save().then(() => res.sendStatus(200)).catch((err) => {
                logger.error(err)
                res.status(400).send({ error: err.message })
            })
        }
        else {
            res.status(400).send({ error: "Cannot verify signature" })
        }
    }
    catch (err) {
        logger.error(err)
        res.status(400).send({ error: err.message })
    }
})

router.post("/test", async (req, res) => {
    try {
        const response = await Form.findOneAndUpdate({ formId: req.query.formId }, {
            $push: {
                responses: {
                    ...req.body,
                    paymentStatus: "pending",
                    txnDate: "pending",
                    txnId: "pending",
                }
            }
        })
        res.send(response)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }

})

router.post("/failed", async (req, res) => {
    try {
        const orderDetails = await instance.orders.fetch(req.body.metadata.order_id)
        var data = {
            txnAmount: orderDetails.amount_paid,
            orderId: req.body.metadata.order_id,
            txnDate: moment.unix(orderDetails.created_at).toISOString(),
        }

        const response = await Form.findOneAndUpdate({ formId: req.query.formId, "responses.orderId": req.body.metadata.order_id }, {
            $set: {
                "responses.$.paymentStatus": "failed",
                "responses.$.txnDate": moment.unix(orderDetails.created_at).toISOString(),
                "responses.$.txnId": "failed",
            }
        })
        notify("failed", data, response.responses[0], response);

        response.save()
            .then(() => res.sendStatus(200))
            .catch((err) => {
                logger.error(err)
                res.status(400).send({ error: err.message })
            })

    }
    catch (err) {
        logger.error(err)
        res.status(400).send({ error: err.message })
    }


})

router.post("/", upload.single("resume"), async (req, res) => {
    try {
        var ammount = JSON.parse(req.body.amount)

        var options = {
            amount: new Date() > new Date(ammount.expries) ? ammount.amount * 100 : ammount.earlyBirdAmount * 100,
            currency: "INR",
            receipt: generateRandomString()
        };
        var order = await instance.orders.create(options);
        order.key = process.env.razorPayId

        const response = await Form.findOneAndUpdate({ formId: req.query.formId }, {
            $push: {
                responses: {
                    ...req.body,
                    // resume: req.file.path,
                    responseId: generateRandomString(10),
                    orderId: order.id,
                    amount: order.amount / 100,
                    paymentStatus: "pending",
                    txnDate: "pending",
                    txnId: "pending",
                }
            }
        })
        var data = req.body;
        if (req.query.formId === "jobfair") {
            data.name = data.firstName + " " + data.lastName
        }
        notify("pending", order, data, response);
        response.save()
            .then(() => res.send(order))
            .catch((err) => {
                logger.error(err)
                res.status(400).send({ error: err.message })
            })

    }
    catch (err) {
        console.log(err)
        logger.error(err)
        return res.status(400).send(err);
    }
})

module.exports = router;
