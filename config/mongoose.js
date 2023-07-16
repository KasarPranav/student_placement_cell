const mongoose =require('mongoose');
const pass = 'acer%4085512';
const env = `mongodb+srv://placementCellAdmin:${pass}@cluster0.sws2wfq.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(env,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const db = mongoose.connection; 

db.on('error',console.error.bind(console,'error while connecting to database'))

db.once('open',function(){
    console.log('successfully connected to the database');
})

module.exports = db;