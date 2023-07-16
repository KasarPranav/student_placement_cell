const studentSchema = require('../models/students');
const batchSchema = require('../models/batch');
module.exports.studentList = async function(req,res){
    if(!req.isAuthenticated()){
        return res.redirect('/users/sign-in');
    }
    const studentList = await studentSchema.find({});
    return res.render('students.ejs',{
        title: "Student Page",
        studentList: studentList
    })
}

module.exports.addStudentForm = async function(req,res){
    if(!req.isAuthenticated()){
        return res.redirect('/users/sign-in');
    }
    const batches = await batchSchema.find({});
    return res.render('add-student.ejs',{
        title: "Create Student Page",
        batches: batches
    })
}

module.exports.createStudent = async function(req,res){
    try {
        const {firstName, lastName, college, react,batch, web, dsa,status} = req.body;
        const student=await studentSchema.create({
            firstName: firstName,
            lastName: lastName,
            collegeName: college,
            batch: batch,
            placementStatus: status,
            reactScore: react,
            DSAScore: dsa,
            webDScore: web
        })
        // console.log(student);
        return res.redirect('/students/students-list');        
    } catch (error) {
        console.log("Error while creating student ",error);
        return;
    }
}


module.exports.getStudentsByBatchId = async function(req,res){
    const batchId = req.params.batchId;
    // console.log(batchName);
    try {
        const studentData = await studentSchema.find({
            batch: batchId
        });    
        return res.status(200).json({
            studentData: studentData
        })
        
    } catch (error) {
        return res.status(500);
    }
}