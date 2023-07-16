const routers = require('express').Router();
const interviewController = require('../controllers/interviewController');
routers.get('/interview-list',interviewController.interviewList);
routers.get('/schedule-form',interviewController.scheduleForm);
routers.post('/schedule',interviewController.schedule);
routers.post('/assign-student', interviewController.assignStudent);

routers.get('/interview-details/:interviewId',interviewController.details);
routers.post('/update-results',interviewController.updateResults);

routers.get('/extract-csv-file', interviewController.extractInterviewData);

module.exports = routers;