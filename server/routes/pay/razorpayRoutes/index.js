const moment = require("moment");
const express = require("express");
var crypto = require("crypto");
const Razorpay = require("razorpay");
const multer = require("multer");

require("dotenv").config();
const genCertificate = require("../../../utils/GenCertificate");
const generateRandomString = require("../../../utils/generateRandomString");
const addDataGoogleSheets = require("../../../utils/addDataGoogleSheets")
const notify = require("../notify");
const Form = require("../../../models/forms");
const logger = require("../../../utils/logger");
const router = express.Router();


var instance = new Razorpay({
  key_id: process.env.razorPayId,
  key_secret: process.env.razorPaySecret,
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorage });

router.get("/orderDetails", async (req, res) => {
  console.log(req.query.orderId);
  try {
    const orderDetails = await instance.orders.fetch(req.query.orderId);
    const applicant = await Form.findOne(
      { formId: req.query.formId },
      {
        responses: { $elemMatch: { orderId: req.query.orderId } },
      }
    );
    // console.log(applicant)
    logger.info(
      `> Reinitated payment for ${applicant.responses[0].name} orderId : ${req.query.orderId}`
    );
    orderDetails.key = process.env.razorPayId;
    orderDetails.userDetails = {
      name: applicant.responses[0].name,
      email: applicant.responses[0].email,
      phone: applicant.responses[0].phone,
    };
    res.send(orderDetails);
  } catch (err) {
    logger.error(err);
    res.status(400).send(err);
  }
});

router.post("/verify", async (req, res) => {
  try {
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", process.env.razorPaySecret)
      .update(body.toString())
      .digest("hex");

    const orderDetails = await instance.orders.fetch(
      req.body.razorpay_order_id
    );
    if (expectedSignature === req.body.razorpay_signature) {
      const response = await Form.findOneAndUpdate(
        { formId: req.query.formId, "responses.orderId": req.query.orderId },
        {
          $set: {
            "responses.$.paymentStatus": "success",
            "responses.$.txnDate": moment
              .unix(orderDetails.created_at)
              .toISOString(),
            "responses.$.txnId": req.body.razorpay_payment_id,
          },
        }
      );
      var data = {
        txnAmount: orderDetails.amount_paid,
        orderId: req.body.razorpay_order_id,
        txnDate: moment.unix(orderDetails.created_at).toISOString(),
        txnId: req.body.razorpay_payment_id,
      };
      // console.log(response)
      const index = response.responses.findIndex(
        (obj) => obj.orderId === req.query.orderId
      );
      const formDetails = await Form.findOne({ formId: req.query.formId });
      notify("success", data, response.responses[index], formDetails);
      response
        .save()
        .then(() => res.sendStatus(200))
        .catch((err) => {
          logger.error(err);
          res.status(400).send({ error: err.message });
        });
    } else {
      res.status(400).send({ error: "Cannot verify signature" });
    }
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});

router.post("/failed", async (req, res) => {
  try {
    const orderDetails = await instance.orders.fetch(
      req.body.metadata.order_id
    );
    var data = {
      txnAmount: orderDetails.amount_paid,
      orderId: req.body.metadata.order_id,
      txnDate: moment.unix(orderDetails.created_at).toISOString(),
    };

    const response = await Form.findOneAndUpdate(
      {
        formId: req.query.formId,
        "responses.orderId": req.body.metadata.order_id,
      },
      {
        $set: {
          "responses.$.paymentStatus": "failed",
          "responses.$.txnDate": moment
            .unix(orderDetails.created_at)
            .toISOString(),
          "responses.$.txnId": "failed",
        },
      }
    );
    const index = response.responses.findIndex(
      (obj) => obj.orderId === req.body.metadata.order_id
    );

    notify("failed", data, response.responses[index], response);

    response
      .save()
      .then(() => res.sendStatus(200))
      .catch((err) => {
        logger.error(err);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});

router.post(
  "/genCertificate",
  upload.single("fileUpload"),
  async (req, res) => {
    try {
      genCertificate(req.body.name,req.body.email);

      var data = [new Date().toLocaleString()];
      data = data.concat(Object.values(req.body));
      data.push(`https://forms.ieee-mint.org/certificates/${req.body.email}.pdf`);

      await addDataGoogleSheets(data);

      const response = await Form.findOneAndUpdate(
        { formId: req.query.formId },
        {
          $push: {
            responses: {
              responseId: generateRandomString(10),
              orderId: generateRandomString(10),
              certificate: `https://forms.ieee-mint.org/certificates/${req.body.email}.pdf`,
              ...req.body,
            },
          },
        }
      );
      //   $set:{
      //     "members.$[elemX].status":true
      //   }
      // },
      // {
      //   "arrayFilters":[
      //     {
      //       "elemX.email":req.body.email
      //     }
      //   ]
      // }
      response
        .save()
        .then(() =>
          res.send({ link: `http://localhost:3000/${req.body.email}.pdf` })
        )
        .catch((err) => {
          logger.error(err);
          res.status(400).send({ error: err.message });
        });
    } catch (err) {
      console.log(err);
      logger.error(err);
      return res.status(400).send(err);
    }
  }
);

router.post("/", upload.single("fileUpload"), async (req, res) => {
  try {
    var ammount = JSON.parse(req.body.amount);
    var order;
    var options = {
      amount: ammount.amount * 100,
      currency: "INR",
      receipt: generateRandomString(),
    };

    if (ammount.amount !== 0) {
      if (req.query.formId === "wlc") {
        order = await instance.orders.create({
          amount: ammount.amount * 100,
          currency: "INR",
          transfers: [
            {
              account: process.env.transferAcc,
              amount: ammount.amount * 100,
              currency: "INR",
              on_hold: 0,
            },
          ],
        });
      } else {
        order = await instance.orders.create(options);
      }

      order.key = process.env.razorPayId;
    } else {
      order = {
        id: generateRandomString(10),
        amount: 0,
        txnId: generateRandomString(10),
        txnDate: new Date().toISOString(),
        txnAmount: 0,
      };
    }

    const response = await Form.findOneAndUpdate(
      { formId: req.query.formId },
      {
        $push: {
          responses: {
            responseId: generateRandomString(10),
            orderId: order.id,
            amount: ammount.amount === 0 ? ammount.amount : order.amount / 100,
            paymentStatus: ammount.amount === 0 ? "success" : "pending",
            txnDate: ammount.amount === 0 ? order.txnDate : "pending",
            txnId: ammount.amount === 0 ? order.txnId : "pending",
            ...req.body,
            ...(req.file !== undefined &&
              req.file.path !== undefined && { fileUpload: req.file.path }),
          },
        },
      }
    );

    if (ammount.amount !== 0) {
      notify("pending", order, req.body, response);
    } else {
      notify("success", order, req.body, response);
    }

    logger.info(`> Razor token created for ${req.body.name}`);

    response
      .save()
      .then(() => res.send(order))
      .catch((err) => {
        logger.error(err);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    console.log(err);
    logger.error(err);
    return res.status(400).send(err);
  }
});

module.exports = router;
