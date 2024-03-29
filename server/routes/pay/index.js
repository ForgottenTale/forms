const express = require('express')
const logger = require('../../utils/logger');
const router = express.Router();
const razorPayRoutes = require('./razorpayRoutes');
const paytmRoutes = require('./paytmRoutes');
const Form = require('../../models/forms')

router.use("/razorpay", razorPayRoutes);
router.use("/paytm", paytmRoutes);

router.post("/addMembers2", async (req, res) => {
    try {

        const response = await Form.findOneAndUpdate({ formId: "clapfeedback" }, {
            members:req.body.members
        })
        return res.send(response)
    }
    catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(err)
    }

})

router.get("/confirmation", async (req, res) => {
    try {

        const response = await Form.findOne({ formId: req.query.formId }, {
            title: 1,
            venue: 1,
            eventDate: 1,
            responses: {
                $elemMatch: { orderId: req.query.orderId }
            }
        })
        return res.send(response)
    }
    catch (err) {
        res.status(400).send({ error: err.message })
        logger.error(err)
    }

})



module.exports = router;