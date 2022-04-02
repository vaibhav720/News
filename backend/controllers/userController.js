const User =require("../models/userModels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const NewsAPI = require('newsapi');
const { response } = require("../app");
const newsApi = new NewsAPI('d575bab0828a4044bed1a0e5d5e14b81');

// Register a User


exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.create(req.body);
    sendToken(user,201,res);

});

// Login user

exports.loginUser =catchAsyncErrors(async (req,res,next)=>{
    const {email,password} = req.body;
    // checking if user has given password and email

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400));
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }
    
    const isPasswordMatched = await user.comparePassword(password);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user,200,res);
});

exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success:true,
        message:"Logged out "
    })
})

//Forgot Password

exports.forgotPassword = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    // Get Reset Password Token

    const resetToken = user.getResetPasswordToken();


    await user.save({validateBeforeSave: false});
    let proto = req.protocol;
    const resetPasswordUrl = proto.concat("://",req.get("host"),"localhost/api/v1/password/reset",resetToken);
    let mess = 'Your password reset token is :- \n\n'
    let message = mess.concat(resetPasswordUrl,'\n\n If you have not requested this email then please ignore it');
    try{
        await sendEmail({
            email:user.email,
            subject:"E-com Password Recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: "Email send to success"
        })

    }catch(error){
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire  = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,500));

    }
});


// Reset Password

exports.resetPassword = catchAsyncErrors(async (req,res,next)=>{

    // creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt: Date.now()}});


    if(!user){
        return next(new ErrorHandler("Reset Password token is invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    
    }

    user.password= req.body.password;
    
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire  = undefined;

    user.save();
    sendToken(user,200,res);

});


exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
});


exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");


    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect Password",400));
    }
    if(req.body.newPassword !== req.body.confirmPassword)
    {
        console.log(req.body.newPassword);
        console.log(req.body.confirmPassword);
        return next(new ErrorHandler("Confirm Password does not match",400));
      
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
});


exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    const user = User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });
    
    res.status(200).json({
        success:true
    });
});


// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users,
    })
})


// Get Single users(admin)
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next( new ErrorHandler("User does not exist",400))
    }
    res.status(200).json({
        success:true,
        users,
    })
});


// Update Role --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });
    
    res.status(200).json({
        success:true
    });
});


// Delete user -- Admin 
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler("User does not exist",400));
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted successfully"
    })
});

//    News Topics


exports.personalNews = catchAsyncErrors(async(req,res,next)=>{
    let ans=[];
    const user = await User.findById(req.user.id);
    await user.topics.forEach(async(item,index)=>{
        await newsApi.v2.everything({
            q: item.name,
            sources: 'bbc-news'
          }, {
            noCache: true
          }).then(async response => {
              let count =0;
            await response.articles.forEach(async(items,index)=>{
                if(count<2)
                {
                    await ans.push(items);
                }
                count++;
            })
            console.log(ans)
          });
        
    });
        console.log(user);
      await res.status(200).json({
        success:true,
        message:ans
    });
});

//    News Topics


exports.trending = catchAsyncErrors(async(req,res,next)=>{
    let ans=[]
    await newsApi.v2.topHeadlines({
        language: 'en',
        country: 'in'
      }, {
        noCache: true
      }).then(response => {
          
            console.log(response.articles[0]);
            ans.push(...response.articles);
        
      });
      console.log(ans);
      res.status(200).json({
        success:true,
        message:ans
    })
});

exports.newTopics = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    //console.log(req.body);
    user.topics.push(req.body);

    const newUser = await User.findByIdAndUpdate(req.user.id,user,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    });
    let ans=[];
    let co=0;
    await user.topics.forEach(async(item,index)=>{
        if(co<5){
            console.log(item.name);
        await newsApi.v2.everything({
            q: item.name,
            sources: 'bbc-news'
          }, {
            noCache: true
          }).then(response => {
            ans.push(...response.articles);
            console.log(ans)
         });
        }
        else{
            
        }
        co++;
    })
    
      res.status(200).json({
        success:true,
        message:ans
    })
});

