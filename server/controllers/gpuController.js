import { errorHandler } from "../utils/errorHandler.js";
import user from '../models/authModel.js'
import sendMailSubscrib from '../utils/sendMail.js';
import { getTryOn } from "../utils/getTryOn.js";


export const tryOn=async(req,res,next)=>{
  if(!req.files['human_Img'] || !req.files['garment_Img'])return next(errorHandler(400,'Both image are required'));

  if(req.user.id!=req.params.id)return next(errorHandler(400,'Unauthorised user'));

  try{
    const currUser=await user.findById(req.params.id);

    if(!currUser)return next(errorHandler(400,'Not User Exist'));

    const currDate=new Date().getDate();

    if(currUser.freeTrial>0 && !currUser.isSubscribed.trialRemaining){
        //TryOn the images Calling the Server
        const imageUrl=await getTryOn(req);
        //Send the Mail to the User
        if(currUser.freeTrial===0 && (!currUser.subscribedMailSendAt || currDate-currUser.subscribedMailSendAt.getDate()!=0)){
          await sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
          currUser.subscribedMailSendAt=new Date();
        }
        //Update the currUser trials
        currUser.freeTrial--;
        //save the currUser data
        await currUser.save();
        // Exclude password from user object
        const {password: pass, ...rest} = currUser._doc;
        //send the responce
        res.status(200).json({imageUrl:imageUrl,user:rest});
    }
    else if(currUser.freeTrial<=0 && currUser.isSubscribed.trialRemaining<=0){
      if(currDate-currUser.isSubscribed.endTime.getDate()<=7){
        //TryOn the images Calling the Server
        const imageUrl=await getTryOn(req);
        //Send the Mail to the User
        if(!currUser.subscribedMailSendAt || currDate-currUser.subscribedMailSendAt.getDate()!=0){
          await sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
          currUser.subscribedMailSendAt=new Date();
          await currUser.save();
        }
         // Exclude password from user object
        const {password: pass, ...rest} = currUser._doc;
        //send the responce
        res.status(200).json({imageUrl:imageUrl,user:rest});
      }
      else{
        //Send the Mail to the User
        if(!currUser.subscribedMailSendAt || currDate-currUser.subscribedMailSendAt.getDate()!=0){
          await sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
          currUser.subscribedMailSendAt=new Date();
          await currUser.save();
        }
        //Send the Error Update the Subscription
        return next(errorHandler(500,"Your Subscription Ended Let's Subscribed the AiLusion"))
      }
    }
    else if(currUser.freeTrial<=0 && !currUser.isSubscribed.trialRemaining){
      //Send the Mail to The User
      if(!currUser.subscribedMailSendAt || currDate-currUser.subscribedMailSendAt.getDate()!=0){
        await sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
        currUser.subscribedMailSendAt=new Date();
        await currUser.save();
      }
      //Send an error Free trials Ended
      return next(errorHandler(500,'Your Free Trials Ended Now Subscribe the AiLusion'));
    }
    else if(currUser.isSubscribed.trialRemaining>=0){
      //Send the Mail to the User
      const imageUrl=await getTryOn(req);
      //Update the currUser trial 
      currUser.isSubscribed.trialRemaining--;
      currUser.isSubscribed.trialUses++;
      if(currUser.isSubscribed.trialRemaining===0){
        currUser.isSubscribed.endTime=new Date();
        //Send the Mail to User
        if(!currUser.subscribedMailSendAt || currDate-currUser.subscribedMailSendAt.getDate()!=0){
          await sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
          currUser.subscribedMailSendAt=new Date();
        }
      }
      await currUser.save();
      // Exclude password from user object
      const {password: pass, ...rest} = currUser._doc;
      //Send the responce
      res.status(200).json({imageUrl:imageUrl,user:rest});
    }
    else{
      //Send the Error
      next(errorHandler(500,'Internal Server Error'));
    }    
  }catch (error) {
    //Send the error
      next(error);
  }
}