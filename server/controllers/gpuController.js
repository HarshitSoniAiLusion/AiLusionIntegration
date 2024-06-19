import { errorHandler } from "../utils/errorHandler.js";
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import user from '../models/authModel.js'
import sendMailSubscrib from '../utils/sendMail.js';


export const tryOn=async(req,res,next)=>{

    if(req.user.id!=req.params.id)return next(errorHandler(400,'Unauthorised user'));

    const currUser=await user.findById(req.params.id);
    console.log(currUser);


    if(currUser.freeTrial>0 && !currUser.isSubscribed.trialRemaining){
        //Update the Trial
        currUser.freeTrial--;
        await currUser.save();
        //Send the Mail And call The GPU
        if(currUser.freeTrial===0)sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
    }
    else if(currUser.freeTrial<=0 && currUser.isSubscribed.trialRemaining<=0){
      if(new Date().getDate()-currUser.isSubscribed.endTime.getDate()<=7){
        //Send the Mail  1 Step and Then Call the GPU
        sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
      }
      else{
        //Send the Mail 1 step
        sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
        //Send the res as a Not Allow to Try On Update Error
        return next(errorHandler(500,'Get Subscribed the AiLusion'))
      }
    }
    else if(currUser.freeTrial<=0 && !currUser.isSubscribed.trialRemaining){
      //send the Mail 1 step 
      sendMailSubscrib(currUser.username,currUser.email,process.env.Your_Email,process.env.Your_Password);
      //Send an error not allow to try on
      return next(errorHandler(500,'Your Free Trials Ended now Subscribe the AiLusion'));
    }
    else if(currUser.isSubscribed.trialRemaining>=0){
      //Update the currUser Trial and Call the GPU
      currUser.isSubscribed.trialRemaining--;
      currUser.isSubscribed.trialUses++;
      if(currUser.isSubscribed.trialRemaining===0){
        currUser.isSubscribed.endTime=new Date();
        //send the Mail we also do this
      }
      await currUser.save();
    }

    //GPU Server Call
    const humanFile=req.files['human_Img'][0].path;
    const garmentFile=req.files['garment_Img'][0].path;
    
    let data = new FormData();
    const __dirname=path.resolve();

    data.append('cloth_image', fs.createReadStream(garmentFile));
    data.append('human_image', fs.createReadStream(humanFile));

    let config = {
     method: 'post',
     maxBodyLength: Infinity,
     url: 'http://ailusiongpumainserver.centralindia.cloudapp.azure.com:8001/process_images',
     headers: { 
       ...data.getHeaders()
     },
     responseType: 'arraybuffer',
     data : data
    };

    const publicFolderPath = path.join(__dirname, 'public');

    // Ensure the public folder exists
    if (!fs.existsSync(publicFolderPath)) {
       fs.mkdirSync(publicFolderPath);
    }

    // Create the file path in the public folder
    const filePath = path.join(publicFolderPath, 'output_image.jpeg');

    axios.request(config)
    .then(async(response) => {
    fs.writeFileSync(filePath, response.data);
    console.log('Image saved as', filePath);
    fs.unlinkSync(humanFile); // Remove the uploaded human image
    fs.unlinkSync(garmentFile); // Remove the uploaded garment image
    const imageUrl = `${req.protocol}://localhost:8080/public/output_image.jpeg?timestamp=${new Date().getTime()}`;
    res.json({ imageUrl: imageUrl });
    })
    .catch((error) => {
        console.log(error);
        next(error);
    });
}