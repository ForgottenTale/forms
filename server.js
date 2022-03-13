require('dotenv').config();
const express = require('express')
const next = require('next')
const Paytm = require('paytm-pg-node-sdk');
const bodyParser = require('body-parser');
const path = require('path');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })
const handle = app.getRequestHandler()




app.prepare().then(() => {
    const server = express()
    middleware()

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }))

    server.get("/api/test", (req, res) => {
        return res.send("Hi")
    })

    server.post("/api/pay", async (req, res) => {
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

            return res.send(details)
        }
        catch (err) {
            return res.send(err)
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
                console.log(" Redirecting")
                // return res.redirect("/confirmation")
                // return res.send(response.responseObject.body)
            }
        }
        catch (err) {
            console.log(err)
        }

    })
    server.get("/api/redirect", (req, res) => {

        console.log("reached")
        return res.redirect("/confirmation")
        // return res.send(response.responseObject.body)


    })
    // This code should be in the last portion
    server.all('*', (req, res) => {
        return handle(req, res)
    })
    server.use('/static', express.static(path.join(__dirname, './public')));

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
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

function middleware() {
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
        console.log("Connection Established")
    }
    catch (e) {
        console.log("Exception caught: ", e);
        Paytm.LoggingUtil.addLog(Paytm.LoggingUtil.LogLevel.INFO, "DemoApp", "Exception caught: ", e);
        console.log("Failed")

    }

}