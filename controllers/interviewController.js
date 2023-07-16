const interviewSchema = require('../models/interview');
const companySchema = require('../models/company');
const batchSchema = require('../models/batch');
const resultSchema = require('../models/interviewResults');
const { populate } = require('../models/students');
const csvWriter = require('csv-writer');
const path = require('path');

module.exports.interviewList = async function(req,res){
    if(!req.isAuthenticated){
        return res.redirect('/users/sign-in');
    }
    let interviewList = await interviewSchema.aggregate(
        [
            {
              $project: { 
                '_id': 1,
                'company': 1,               
                'interviewDateTime': { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$interviewDateTime", timezone: "Asia/Kolkata"} },
                'scheduledBy': 1
              }
            },{
              $lookup: {
                from: "companies",
                localField: "company",
                foreignField: "_id",
                as: "companyName"
              }
            }
        ]
    );
    return res.render('interview',{
        title: "Interview List",
        interviewList: interviewList
    })
}

module.exports.scheduleForm = async function(req,res){
    if(!req.isAuthenticated){
        return res.redirect('/users/sign-in');
    }
    const companies = await companySchema.find({});
    return res.render('schedule-interview',{
        title: "Interview List",
        company: companies
    })
}
module.exports.schedule = async function(req,res){
    if(!req.isAuthenticated){
        return res.redirect('/users/sign-in');
    }
    const {companyName, dateTime, skills, jobDescription} = req.body;
    const scheduledBy = res.locals.user.name;
    try {
        const interview = await interviewSchema.create({
            company: companyName,
            interviewDateTime: new Date(dateTime),
            jobDescription: jobDescription,
            skills: skills,
            scheduledBy: scheduledBy
        });
        return res.redirect('/interview/interview-list');
    } catch (error) {
        console.log("Error while scheduling Interview ",error);
    }   
}

module.exports.details = async function(req,res){
    if(!req.isAuthenticated){
        return res.redirect('/users/sign-in');
    }
    const interview = await interviewSchema.findById(req.params.interviewId)
                                           .populate('company')
                                           .populate(
                                            {
                                                path: 'results',
                                                populate:{
                                                    path: 'student',
                                                    select: {firstName: 1, lastName: 1, batch: 1},
                                                    populate: {
                                                        path: 'batch',                                                    
                                                    }
                                                } 
                                            });
    // console.log(interview.results);
    const batches = await batchSchema.find({});
    return res.render('interviewDetails.ejs',{
        title: "Interview Details",
        interview: interview,
        batch: batches
    });
}

module.exports.assignStudent = async function(req,res){
    // console.log(req.body);
    const {batchId, interviewId, studentId} = req.body;
    try {
        const interview = await interviewSchema.findById(interviewId);
        const stdExists = interview.student.find((id) => {
            return id == studentId;
        })
        if (!stdExists) {
            const result = await resultSchema.create({
                interview: interviewId,
                student: studentId,
                result: 'Pending'
            })
            interview.results.push(result._id);
            interview.student.push(studentId);
            await interview.save();
        }
        return res.redirect('back');

    } catch (error) {
        console.log('Error While assigning student to an Interview ',error);
        return;
    }
}

module.exports.updateResults = async function(req,res){
    // console.log(req.xhr);
    try {
        if(req.xhr){
            // console.log(req.body);
            const {resultId, result} = req.body;
            const updatedResult = await resultSchema.findByIdAndUpdate(resultId, {
                result: result
            });
            return res.status(200).json({
                result: updatedResult,
                success: true,
                updatedValue: result
            })
        }
        
    } catch (error) {
        console.log("Error while updating result at server side ",error);
        return res.status(400);        
    }
}

module.exports.extractInterviewData = async function(req,res){
    // const interviewData = await interviewSchema.aggregate([
    //     {
    //         $lookup: {
    //             from: "companies",
    //             localField: "company",
    //             foreignField: "_id",
    //             as: "companyName"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "students",
    //             localField: "student",
    //             foreignField: "_id",
    //             as: "student"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "results",
    //             localField: "results",
    //             foreignField: "_id",
    //             as: "result"
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: "$student"
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: "$result"
    //         } 
    //     },
    //     {
    //         $project: {
    //             student: 1,
    //             result: 1,
    //             skills: 1,
    //             jobDescription: 1,
    //             scheduledBy: 1,
    //             companyName: "$companyName.companyName"           
    //         }
    //     },
    //     {
    //         $match: {
    //             "$expr": {$eq:["$result.student","$student._id"]}
    //         }
    //     }
    // ]);
    try {
        const extractDataFromResultSchema = await resultSchema.aggregate([
            {
                $lookup: {
                    from: "students",
                    localField: "student",
                    foreignField: "_id",
                    as: "student"
                }
            },
            {
               $lookup: {
                from: "interviews",
                localField: "interview",
                foreignField: "_id",
                as: "interview"
               }
            },
            {
                $project: {
                    "Name": { $concat:[{ $first: "$student.firstName" }," ",{ $first: "$student.lastName" }]},
                    "College": {$first: "$student.collegeName"},
                    "Batch": {$first:"$student.batch"},
                    "Result": "$result",
                    "Placement Status": {$first:"$student.placementStatus"},
                    "Interview Timings": {$first:"$interview.interviewDateTime"},
                    "Skills": {$first: "$interview.skills"},
                    "company": {$first: "$interview.company"},
                    "Scheduled By": {$first: "$interview.scheduledBy"}
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "CompanyName"
                }
            },
            {
                $lookup: {
                    from: "batches",
                    localField: "Batch",
                    foreignField: "_id",
                    as: "batchName"
                }
            },
            {
                $project: {
                    "Name": 1,
                    "College": 1,
                    "Batch": {$first: "$batchName.batch"},
                    "Result": 1,
                    "Placement Status": 1,
                    "Interview Timings": 1,
                    "Skills": 1,
                    "Company": {$first: "$CompanyName.companyName"},
                    "Scheduled By": 1
                }
    
            }        
        ]);
        const writer= csvWriter.createObjectCsvWriter({
            path: path.join(__dirname,'..','/placement_report/report.csv'),
            header: [
                {id: 'Name',title: "Name"},
                {id: "College", title: "College"},
                {id: "Company", title: "Company"},
                {id:"Interview Timings", title: "Interview Timings"},
                {id:"Scheduled By", title: "Scheduled By"},
                {id:"Batch", title: "Batch"},
                {id:"Skills", title: "Skills"},
                {id:"Result", title: "Result"},
                {id: "Placement Status", title: "Placement Status"}            
            ]
        });
        await writer.writeRecords(extractDataFromResultSchema);
        // console.log("***Data written Successfully");
        // console.log(extractDataFromResultSchema);
        return res.redirect('/resources/report.csv');        
    } catch (error) {
        console.log("Error while creating csv file: ",error);
        return;
    }
    
}