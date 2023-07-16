const mongoose = require('mongoose');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/avatar');
const multer = require('multer');


const employeeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
},{
    timestamps:true
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log('***** Request.body :',req.body);
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })

  employeeSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
  employeeSchema.statics.AVATAR_PATH = AVATAR_PATH;


module.exports = mongoose.model('Employee', employeeSchema);