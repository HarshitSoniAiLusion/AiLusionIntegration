import { errorHandler } from "../utils/errorHandler.js";
import user from '../models/authModel.js';

export const getUser=(req,res,next)=>{
    res.json({message:'Done'});
}
export const setUserPrivacy=async(req,res,next)=>{
    if(req.params.id!=req.user.id){
        next(errorHandler(400,'Unauthorised User'));
        return;
    }
    try {
        const updateUser=await user.findByIdAndUpdate(req.params.id,{$set:{isPrivacyChecked:req.body.check}},{new:true});
        const {password:pass,...rest}=updateUser._doc;
        res.status(200).json(rest);
    } catch (err) {
        next(err);
        return;
    }
}