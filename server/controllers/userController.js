import user from '../models/userModel.js';
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
        res.status(200).cookie('aiLusion_token',token,{httpOnly:true},{expiresIn:'7d'}).json(rest);
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
        res.status(200).cookie('aiLusion_token',token,{httpOnly:true},{expiresIn:'7d'}).json(rest);
    } 
    catch(err){
        next(err);
        return;
    }
}