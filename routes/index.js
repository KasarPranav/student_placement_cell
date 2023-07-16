const routers = require('express').Router();
const homeController = require('../controllers/homeController');
const passport = require('passport');
const companySchema = require('../models/company');
const batchSchema = require('../models/batch');


routers.use('/users',require('./users'));
routers.use('/students',passport.checkAuthentication,require('./students'));
routers.use('/company',passport.checkAuthentication,require('./company'));
routers.use('/interview',passport.checkAuthentication,require('./interview'));
// routers.post('/createCompany',async (req,res)=>{
//     const company = await companySchema.create({
//         companyName: req.body.company
//     });
//     return res.status(200).json({
//         message: "company Created Successfully",
//         company: company
//     })
// })
// routers.post('/createBatch',async (req,res)=>{
//     const batch = await batchSchema.create({
//         batch: req.body.batch
//     });
//     return res.status(200).json({
//         message: "Batch Created Successfully",
//         batch: batch
//     })
// })

routers.get('/',passport.checkAuthentication,homeController.accessHomePage);

module.exports = routers;