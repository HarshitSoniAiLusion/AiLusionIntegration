import user from '../models/userModel.js';
import { errorHandler } from '../utils/errorHandler.js';
import bcrypt from 'bcrypt'
import validateEmail from '../utils/isValidEmail.js';

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
        res.send({JSON,msg:'User SignUp SuccessFully'});
    }
    catch(err){
        next(err);
    }
}