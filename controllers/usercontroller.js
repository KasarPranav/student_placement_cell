const employeeSchema = require('../models/employee');


module.exports.createUser = async function(req,res){ 
    const {email, password, name, confirmPassword} = req.body;
    try {
        let employee = await employeeSchema.findOne({email: email});
        if(employee || password != confirmPassword){
            return res.redirect('back');
            // return res.status(200).json({
            //     message: "Employee already exists"
            // });
        }
        employee = await employeeSchema.create({
            email: email,
            name: name,
            password: password
        });

        return res.redirect('/users/sign-in');
       
        // return res.status(200).json({
        //     message: "You arrived to signup",
        //     data: employee
        // });
        
    } catch (error) {
        console.log("Error While Creating User: ",error)
    }   
}


module.exports.createSession = async function (req, res) {
    console.log('session created successfully');
    return res.redirect('/');

} 

module.exports.signInPage = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    return res.render('sign-in.ejs',{
        title: "Sign-In Page"
    })
}

module.exports.signUpPage = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    return res.render('sign-up.ejs',{
        title: "Sign-Up Page"
    })
}

module.exports.destroySession = function(req,res){
    req.logout(function(err){
        if(err){
            return res.redirect('/');
        }
    })
    return res.redirect('/users/sign-in');
}