const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

process.on("uncaughtException",(err)=>{
    console.log("Error: "+err.message);
    console.log("Shutting down the server due to unhandled promise Rejection");
    process.exit(1);
});

// Config

dotenv.config({path:"backend/config/config.env"});

connectDatabase();

app.listen(process.env.PORT,()=>{
    console.log("Server is working ");
})

// Unhandled Promise Rejection

process.on("unhandledRejection",err=>{
    console.log("Error:"+err.message);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1);
    });
});