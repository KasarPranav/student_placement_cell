const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const employeeSchema = require('../models/employee');


passport.use('local',new LocalStrategy({
   usernameField: 'email'
},
    async function(email, password, done) {
        try {
            const user = await employeeSchema.findOne({ email: email, password: password });    
            if (!user) { return done(null, false); }
            // if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);            
        } catch (error) {
            return done(error);           
        }      
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
    try {
        const user = await employeeSchema.findById(id);
        done(null, user)
    } catch (error) {
        done(error);
    }
});

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // IMP Testing
       res.locals.user = req.user;
    }
    return next();
}

module.exports = passport;