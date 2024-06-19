import user from '../models/authModel.js';
import { errorHandler } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt'
import validateEmail from '../utils/isValidEmail.js';
import jwt from 'jsonwebtoken';

export const signup=async(req,res,next)=>{
    if(!req.body.username || !req.body.email || !req.body.password || req.body.username==='' || req.body.email==='' || req.body.password===''){
        next(errorHandler(500,'All Fields are required to Fill'));
        return;
    }
    if(req.body.password.length<8){
        next(errorHandler(500,'required the minimum password length 8 characters'));
        return;
    }
    const check=await validateEmail(req.body.email,process.env.Hunter_API);
    if(!check){
        next(errorHandler(404,'Email is not Valid'));
        return;
    }
    try{
        const hashedPassword=bcrypt.hashSync(req.body.password,10);
        const newUser=new user({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });
        await newUser.save();
        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
        const {password:pass,...rest}=newUser._doc;
        res.status(200).cookie('aiLusion_token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
            secure: process.env.NODE_ENV === 'production', // Set secure flag for production
            path: '/', // Make it available for the whole domain
        }).json(rest);
    }
    catch(err){
        next(err);
    }
}

export const signin = async(req,res,next)=>{
    if(!req.body.email || !req.body.password || req.body.username==='' || req.body.password===''){
        next(errorHandler(500,'Email and password both are required'));
        return;
    }
    try{
        const currUser=await user.findOne({email:req.body.email});
        if(!currUser){
            next(errorHandler(400,'User Not Exist'));
            return;
        }
        let validatePassword = bcrypt.compareSync(req.body.password,currUser.password);
        if(!validatePassword){
            return next(errorHandler(500,'Incorrect Password'));
        }
        const {password:pass,...rest}=currUser._doc;
        const token=jwt.sign({id:currUser._id},process.env.JWT_SECRET);
        res.status(200).cookie('aiLusion_token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
            secure: process.env.NODE_ENV === 'production', // Set secure flag for production
            path: '/', // Make it available for the whole domain
          }).json(rest);
    } 
    catch(err){
        next(err);
        return;
    }
}

export const googleAuth=async (req,res,next)=>{
   const {name,email}=req.body;
   try{
       const currUser=await user.findOne({email:email});
       if(currUser){
           const token=jwt.sign({id:currUser._id},process.env.JWT_SECRET);
           const {password:pass,...rest}=currUser._doc;
           res.status(200).cookie('aiLusion_token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
            secure: process.env.NODE_ENV === 'production', // Set secure flag for production
            path: '/', // Make it available for the whole domain
          }).json(rest);     
       }
       else{
           const genratePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
           const hashedPassword=bcrypt.hashSync(genratePassword,10);
           const newUser=new user({
            username:name.toLowerCase().split(' ').join(''),
            email:email,
            password:hashedPassword
           });
           await newUser.save();
           const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
           const {password:pass,...rest}=newUser._doc;
           res.status(200).cookie('aiLusion_token', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
            secure: process.env.NODE_ENV === 'production', // Set secure flag for production
            path: '/', // Make it available for the whole domain
          }).json(rest);
       }
   }
   catch(err){
      return next(err);
   }
}