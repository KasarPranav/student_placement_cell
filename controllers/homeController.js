module.exports.accessHomePage = function(req,res){
    return res.render('home.ejs',{
        title: "Home Page"
    });
}