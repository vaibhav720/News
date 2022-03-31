const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next)=>{
    err.statusCode= err.statusCode || 500,
    err.message = err.message || "Internal Server Error";


    // Wrong mongodb error

    if(err.name==="CastError"){
        const message = "Resource not found. Invalid";
        err = new ErrorHandler(message,400);
    }

    if(err.code === 11000){
        const message ="Email already exist";
        err = new ErrorHandler(message,400);
    }

    if(err.name === "JsonWebTokenError"){
        const message ="Json web invalid try again";
        err = new ErrorHandler(message,400);
    }

    if(err.name === "TokenExpiredError"){
        const message ="Json web token expired";
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}