const express = require("express");
const Applicant = require("../../models/applicant");
const logger = require("../../utils/logger");
const router = express.Router();
const sendMail = require("./sendMail");
const pendingTemplate = require("../../mailTemplates/registerPending");
const successTemplate = require("../../mailTemplates/registerSuccess");
const Form = require("../../models/forms");
const discountRoutes = require("./discounts");
const generateRandomString = require("../../utils/generateRandomString");

router.use("/discounts", discountRoutes);

router.post("/create", async (req, res) => {
  try {
    const response = await new Form({
      formId: generateRandomString(6),
      title: req.body.title,
      description: "",
      responses: [],
      venue: req.body.venue,
      eventDate: req.body.eventDate,
      banner: req.body.banner,
    });
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

router.get("/responses", async (req, res) => {
  try {
    // const applicants = await Applicant.find({})
    const responses = await Form.findOne({ formId: req.query.formId });
    res.send(responses);
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});
router.post("/addresponses", async (req, res) => {
  try {
    req.body.forEach(async (person) => {
      var order = {
        orderId: generateRandomString(10),
        txnDate: new Date().toISOString(),
        txnId: generateRandomString(10),
      };
      const response = await Form.findOneAndUpdate(
        { formId: req.query.formId },
        {
          $push: {
            responses: {
              ...person,
              responseId: generateRandomString(10),
              orderId: order.orderId,
              amount: JSON.stringify({
                label: "Manual added",
                amount: person.amount,
              }),
              paymentStatus: "success",
              membershipType: "Non IEEE members Industry",
              txnDate: order.txnDate,
              txnId: order.txnId,
              promoCode: "Form Owner added",
            },
          },
        }
      );
      sendMail(
        person.email,
        `${response.title} | Registration Successful`,
        successTemplate({
          name: person.name,
          orderId: order.orderId,
          amount: person.amount * 100,
          paymentStatus: "Success",
          txnDate: new Date(order.txnDate),
          txnId: order.txnId,
          email: person.email,
          phone: person.phone,
          banner:
            process.env.NODE_ENV === "development"
              ? `http://localhost:3000/form%20banners/${response.banner}`
              : `https://forms.ieee-mint.org/form%20banners/${response.banner}`,
          title: response.title,
          venue: response.venue,
          eventDate: response.eventDate,
          formId: response.formId,
        })
      );

      response
        .save()
        .then(() => console.log("Saved"))
        .catch((err) => {
          logger.error(err);
          res.status(400).send({ error: err.message });
        });
    });
    res.sendStatus(201);
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});
router.post("/mail", async (req, res) => {
  try {
    var emailIds = req.body.to.split(",");
    sendMail(emailIds, req.body.subject, req.body.msg);
    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});
router.delete("/response", async (req, res) => {
  try {
    await Form.updateOne(
      { formId: req.query.formId },
      {
        $pull: { responses: { responseId: req.query.responseId } },
      }
    );
    res.sendStatus(201);
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});

router.post("/mail/reminder", async (req, res) => {
  try {
    const response = await Form.findOne({ formId: req.query.formId });
    response.responses.forEach((applicant) => {
      if (applicant.paymentStatus === "pending") {
        sendMail(
          applicant.email,
          `${response.title} | Registration pending`,
          pendingTemplate({
            name: applicant.name,
            orderId: applicant.orderId,
            amount: JSON.parse(applicant.amount).amount * 100,
            paymentStatus: "pending",
            txnDate:
              applicant.timeStamp !== undefined
                ? applicant.timeStamp
                : new Date(),
            email: applicant.email,
            phone: applicant.phone,
            banner:
              process.env.NODE_ENV === "development"
                ? `http://localhost:3000/form%20banners/${response.banner}`
                : `https://forms.ieee-mint.org/form%20banners/${response.banner}`,
            title: response.title,
            venue: response.venue,
            eventDate: response.eventDate,
            formId: response.formId,
          })
        );
      }
    });

    res.sendStatus(200);
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});

router.get("/jobfairUpdate", async (req, res) => {
  try {
    const response = await Applicant.find({}, { _id: false, __v: false });
    const updated = [];
    response.map((e) => {
      updated.push({
        name: e.firstName + " " + e.lastName,
        responseId: generateRandomString(10),
        membershipType: e.ieeeMember ? "IEEE Member" : "Non IEEE Member",
        ...e._doc,
      });
    });
    await Form.updateOne({ formId: "jobfair" }, { responses: updated });
    res.send(updated);
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});

router.get("/pricing", async (req, res) => {
  try {
    const response = await Form.findOne({ formId: req.query.formId });
    res.send({
      pricing: response.pricing,
      members: response.members,
      specific: response.specific,
    });
  } catch (err) {
    logger.error(err);
    res.status(400).send({ error: err.message });
  }
});

router.post("/test", async (req, res) => {
  try {
    const response = await Form.findOneAndUpdate(
      { formId: "wlc" },
      {
        pricing: req.body,
      }
    );
    response
      .save()
      .then(() => res.send(response))
      .catch((err) => {
        logger.error(err);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

router.post("/member", async (req, res) => {
  console.log(req.body.data);
  try {
    const response = await Form.findOneAndUpdate(
      { formId: "wlc" },
      {
        members: req.body.data,
      }
    );
    response
      .save()
      .then(() => res.send(response))
      .catch((err) => {
        logger.error(err);
        res.status(400).send({ error: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

module.exports = router;
