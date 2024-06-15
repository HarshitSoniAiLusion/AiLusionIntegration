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
export const subscribeUser=async(req,res,next)=>{
    const {trial}=req.body;
    if(req.user.id!=req.params.id){
        next(errorHandler(400,'UnAuthorised User'));
        return;
    }
    try{
        const curruser=await user.findById(req.params.id);
        if(curruser.isSubscribed && Object.keys(curruser.isSubscribed).length > 0){
            curruser.isSubscribed.startTime=new Date();
            curruser.isSubscribed.totalTrials+=trial;
            curruser.isSubscribed.trialRemaining+=trial;
        }
        else{
            curruser.isSubscribed={
                startTime: new Date(),
                totalTrials: trial,
                remainingTrials: trial,
                usedTrials: 0
            }
        }
        await curruser.save();
        const {password:pass,...rest}=curruser._doc;
        res.status(200).json(rest);
    }catch(err){
        next(err);
    }
}