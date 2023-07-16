const routers = require('express').Router();
const stdentController = require('../controllers/studentController');
const passport = require('passport');


routers.get('/students-list', stdentController.studentList);
routers.get('/add-student',stdentController.addStudentForm);
routers.post('/create-student',stdentController.createStudent);
routers.get('/getStudentByBatchName/:batchId',stdentController.getStudentsByBatchId);


module.exports = routers;