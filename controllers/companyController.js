const companySchema = require('../models/company');

module.exports.companyList =async function(req,res){
    if(!req.isAuthenticated){
        return res.redirect('/users/sign-in')
    }
    try {
        const companies = await companySchema.find({});
        return res.render('company-list.ejs',{
            title: "Company List Page",
            companyList: companies
        })
    } catch (error) {
        console.log("Error while rendering companyList Page ",error);
        return;
    }
}