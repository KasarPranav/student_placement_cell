const mongoose = require('mongoose');
const path = require('path');

const interviewSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    }],
    interviewDateTime: {
        type: Date,
        required: true
    },
    skills: {
        type: String
    },
    jobDescription: {
        type: String,
        required: true
    },
    results: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Results'
    }],
    scheduledBy: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Interview',interviewSchema);
