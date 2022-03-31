const mongoose = require("mongoose");


const connectDatabase =()=>{
    mongoose.connect(process.env.DB_URI,{}).then((data)=>{
        console.log("MongoDb Connected to the server");
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = connectDatabase