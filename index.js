const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./config/mongoose');
const ejsLayouts = require('express-ejs-layouts');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passportLocal');



// var store = new MongoDBStore({
//     uri: `mongodb+srv://placementCellAdmin:acer%4085512@cluster0.sws2wfq.mongodb.net/?retryWrites=true&w=majority`,
//     collection: 'Session'
// });
// Setup views 

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

// extract styles and scripts for sub pages
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.static('./assets'));
app.use('/resources',express.static('./placement_report'));
app.use(ejsLayouts);
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(expressSession({
    name: 'OSPemp',
    // TODO change the secret before deployment in production mode
    secret: "Kochikame",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:MongoStore.create({
        mongoUrl: `mongodb+srv://placementCellAdmin:acer%4085512@cluster0.sws2wfq.mongodb.net/?retryWrites=true&w=majority`
      })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//console.log(app);

app.use('/',require('./routes'));
app.listen(PORT, function(err){
    if(err){
        console.log(`Error in running the server on port : ${PORT}`);
    }
    console.log(`Up & running the server on port : ${PORT}`);
})