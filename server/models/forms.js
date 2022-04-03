const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicantSchema = new Schema({

    name: { type: String },
    title: { type: String },
    description: { type: String },
    responses: [
       Object
    ],
}, { timestamps: true })

const Applicant = mongoose.model('Form', applicantSchema)
module.exports = Applicant;