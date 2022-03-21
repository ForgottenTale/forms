require('dotenv').config();
const express = require('express')
const next = require('next')
const Paytm = require('paytm-pg-node-sdk');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path');
const Applicant = require('./models/applicant')
const mongoose = require('mongoose')
const cors = require("cors");
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const logger = require("./logger");

const handle = app.getRequestHandler()



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})
const upload = multer({ storage: fileStorage })

app.prepare().then(() => {
    const server = express()
    connectToPaytm()

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }))

    server.get("/api/test", (req, res) => {
        return res.send("Hi")
    })

    server.post("/api/jobfair/pay", upload.single("resume"), async (req, res) => {
        try {
            var txnId = await generateTxnId(req)

            const applicant = new Applicant({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                institute: req.body.institute,
                branch: req.body.branch,
                yearofPassout: req.body.yearofPassout,
                CGPA: req.body.CGPA,
                backlog: req.body.backlog,
                ieeeMember: req.body.ieeeMember,
                resume: req.file.path,
                orderId: txnId.orderId,
                amount: txnId.TXN_AMOUNT,
                paymentStatus: "Pending",
                bankId: "Pending",
                txnDate: "Pending",
                txnId: "Pending"
            })
            applicant.save()
                .then(() => res.send(txnId))
                .catch((err) => {
                    logger.error(err)
                    res.status(400).send({ error: err.message })
                })
        }
        catch (err) {
            logger.error(err)
            return res.status(400).send(err);
        }
    })

    server.post("/api/pay", async (req, res) => {
        try {
            var txnId = await generateTxnId(req)
            return res.send(txnId)
        }
        catch (err) {
            return res.send(err)
        }

    })
    server.get("/api/confirmation", async (req, res) => {


        try {
            var orderId = req.query.id;
            var readTimeout = 80000;
            var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
            var paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();
            var response = await Paytm.Payment.getPaymentStatus(paymentStatusDetail);
            if (req.query.type === "jobfair") {
                var txnId = await Applicant.findOne({ orderId: req.query.id })
                return res.send(txnId)
            }
        }
        catch (err) {
            res.status(400).send({ error: err.message })
            logger.error(err)
        }

    })

    server.post("/api/callback", async (req, res) => {

        try {
            var orderId = req.body.ORDERID;
            var readTimeout = 80000;
            var paymentStatusDetailBuilder = new Paytm.PaymentStatusDetailBuilder(orderId);
            var paymentStatusDetail = paymentStatusDetailBuilder.setReadTimeout(readTimeout).build();
            var response = await Paytm.Payment.getPaymentStatus(paymentStatusDetail);

            if (response.responseObject.body.resultInfo.resultStatus === "TXN_SUCCESS") {

                await Applicant.findOneAndUpdate({ orderId: req.body.ORDERID }, {
                    amount: response.responseObject.body.txnAmount,
                    paymentStatus: "success",
                    bankId: response.responseObject.body.bankTxnId,
                    txnDate: response.responseObject.body.txnDate,
                    txnId: response.responseObject.body.txnId,
                })

                return res.redirect(`http://localhost:3000/confirmation/jobfair/${req.body.ORDERID}`)
                // res.status(201).send("done")
            }
            else {
                await Applicant.findOneAndUpdate({ orderId: req.body.ORDERID }, {
                    paymentStatus: "failed",
                    bankId: "failed",
                    txnDate: response.responseObject.body.txnDate,
                    txnId: response.responseObject.body.txnId,
                })
                return res.redirect(`http://localhost:3000/confirmation/jobfair/${req.body.ORDERID}`)
                // res.status(201).send("done")

            }

        }
        catch (err) {
            res.status(400).send(err)
            logger.error(err)
            // res.redirect("http://localhost:3000/confirmation")
        }

    })
    server.get("/api/redirect", (req, res) => {

        // logger.error("reached")
        return res.redirect("/confirmation")
        // return res.send(response.responseObject.body)


    })
    // This code should be in the last portion
    server.all('*', (req, res) => {
        return handle(req, res)
    })
    server.use('/static', express.static(path.join(__dirname, './public')));
    server.use(cors());
    server.options("*", cors());
    mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => server.listen(port, (err) => {
            logger.info(`> Connected to MongoDB`)
            if (err) throw err
            logger.info(`> Ready on http://localhost:${port}`)
        }))
        .catch((err) => logger.error(err))


})

function generateRandomString(count) {
    var ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = ALPHA_NUMERIC_STRING.length;
    var rand = '';
    for (var i = 0; i < count; i++) {
        var start = Math.floor(Math.random() * charactersLength) + 1;
        rand += ALPHA_NUMERIC_STRING.substr(start, 1);
    }
    return rand;
}

const generateTxnId = async (req) => {
    try {
        var channelId = Paytm.EChannelId.WEB;
        var orderId = generateRandomString(10);
        var txnAmount = Paytm.Money.constructWithCurrencyAndValue(Paytm.EnumCurrency.INR, "10.00");
        var userInfo = new Paytm.UserInfo(generateRandomString(10));
        userInfo.setEmail(req.body.email);
        userInfo.setFirstName(req.body.firstName);
        userInfo.setLastName(req.body.lastName);
        userInfo.setMobile(req.body.phone);
        var paymentDetailBuilder = new Paytm.PaymentDetailBuilder(channelId, orderId, txnAmount, userInfo);
        var paymentDetail = paymentDetailBuilder.build();
        var response = await Paytm.Payment.createTxnToken(paymentDetail);

        var details = {
            mid: process.env.Merchant_Id,
            orderId,
            "CHECKSUMHASH": response.responseObject.head.signature,
            "txnToken": response.responseObject.body.txnToken,
            TXN_AMOUNT: "10.00",
            WEBSITE: "WEBSTAGING",
        }
        logger.info(details)

        return details
    }
    catch (err) {
        logger.error(err)
        return err
    }
}

function connectToPaytm() {
    try {
        var env = Paytm.LibraryConstants.STAGING_ENVIRONMENT;
        var mid = process.env.Merchant_Id;
        var key = process.env.Merchant_Key;
        var website = process.env.Website;
        var client_id = process.env.client_id;
        var callbackUrl = process.env.Callback;
        Paytm.MerchantProperties.setCallbackUrl(callbackUrl);
        Paytm.MerchantProperties.initialize(env, mid, key, client_id, website);
        Paytm.MerchantProperties.setConnectionTimeout(5000);
        logger.info(`> Connected to Paytm Servers`)
    }
    catch (e) {
        logger.error("Exception caught: ", e);
        Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "DemoApp", "Exception caught: ", e);
        logger.error("Failed")

    }

}