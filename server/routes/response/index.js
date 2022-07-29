const express = require("express");
const logger = require("../../utils/logger");
const router = express.Router();
const Form = require("../../models/forms");
const generateRandomString = require('../../utils/generateRandomString')

router.post("/", async (req, res) => {
  try {
    var order = {
      id: generateRandomString(10),
      response: generateRandomString(10),
    };

    const response = await Form.findOneAndUpdate(
      { formId: req.query.formId },
      {
        $push: {
          responses: {
            orderId: order.id,
            responseId: order.response,
            ...req.body,
          },
        },
      }
    );
    response
      .save()
      .then(() => res.send(order))
      .catch((err) => {
        logger.error(err);
        res.status(400).send({ error: err.message });
      });
    // return res.send(response)
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(err);
  }
});

module.exports = router;
