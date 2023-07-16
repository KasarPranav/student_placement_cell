const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batch: {
        type: String,
        required: true,
        unique: true
    }
},{
   timestamps: true 
})

module.exports = mongoose.model('Batch',batchSchema);