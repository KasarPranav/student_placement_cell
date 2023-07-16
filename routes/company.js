const routers = require('express').Router();
const companyController = require('../controllers/companyController');

routers.get('/company-list', companyController.companyList);


module.exports = routers;