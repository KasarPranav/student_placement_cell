const mongoose = require('mongoose');
const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students',
        required: true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
        required: true
    },
    result: {
        type: String,
        enum: ['Pass','Fail','Pending'],
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Results',resultSchema);