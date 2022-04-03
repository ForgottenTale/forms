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
        cb(null, './files')
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

    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', process.env.razorPaySecret)
        .update(body.toString())
        .digest('hex');

    const orderDetails = await instance.orders.fetch(req.body.razorpay_order_id)
    if (expectedSignature === req.body.razorpay_signature) {


        // const applicant = await Applicant.findOneAndUpdate({ orderId: req.body.razorpay_order_id }, {
        //     paymentStatus: "success",
        //     txnDate: moment.unix(orderDetails.created_at).toISOString(),
        //     txnId: req.body.razorpay_payment_id,
        // });
        const response = await Form.findOneAndUpdate({ formId: req.query.formId, "responses.orderId": req.query.orderId }, {
            $set: {
                "responses.$.paymentStatus": success,
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
        notify("success", data, applicant);
        response.save().then(() => res.sendStatus(200)).catch((err) => {
            logger.error(err)
            res.status(400).send({ error: err.message })
        })
    }
    else {
        res.sendStatus(200)
    }


})

router.post("/test", async (req, res) => {
    try {
        const response = await Form.findOne({ "responses.orderId": req.query.orderId }, { responses: { $elemMatch: { orderId: req.query.orderId } } })
        res.send(response)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(400)
    }

})

router.post("/failed", async (req, res) => {

    const orderDetails = await instance.orders.fetch(req.body.metadata.order_id)
    var data = {
        txnAmount: orderDetails.amount_paid,
        orderId: req.body.metadata.order_id,
        txnDate: moment.unix(orderDetails.created_at).toISOString(),
    }

    const response = await Form.findOneAndUpdate({ formId: req.query.formId, "responses.orderId": req.query.orderId }, {
        $set: {
            "responses.$.paymentStatus": "failed",
            "responses.$.txnDate": moment.unix(orderDetails.created_at).toISOString(),
            "responses.$.txnId": "failed",
        }
    })
    notify("failed", data, applicant);

    response.save()
        .then(() => res.sendStatus(200))
        .catch((err) => {
            logger.error(err)
            res.status(400).send({ error: err.message })
        })

})

router.post("/", upload.single("resume"), async (req, res) => {
    try {
        var getAmt = () => {
            if (req.query.formId === "jobfair") {
                return req.body.ieeeMember === "true" ? 25000 : 50000
            }
            else {
                return 25000
            }
        }
        var options = {
            amount: getAmt(),
            currency: "INR",
            receipt: generateRandomString()
        };
        var order = await instance.orders.create(options);
        order.key = process.env.razorPayId

        const response = await Form.findOneAndUpdate({ formId: req.query.formId }, {
            $push: {
                responses: {
                    ...req.body,
                    orderId: order.id,
                    amount: order.amount / 100,
                    paymentStatus: "Pending",
                    txnDate: "Pending",
                    txnId: "Pending",
                }
            }
        })
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
