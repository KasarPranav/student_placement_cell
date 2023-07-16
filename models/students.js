const mongoose = require('mongoose');
const path = require('path');


const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    placementStatus: {
        type: String,
        required: true,
        enum: ['Placed','Not_Placed']
    },
    interview: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview'
    }],
    reactScore: {
        type: Number,
        required: true
    },
    webDScore: {
        type: Number,
        required: true
    },
    DSAScore: {
        type: Number,
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Students',studentSchema);