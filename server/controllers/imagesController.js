import {errorHandler} from '../utils/errorHandler.js'
import images from '../models/imagesModel.js'
export const getImages=(req,res,next)=>{
    res.send('You got the images');
}

export const addImage=async(req,res,next)=>{
    const {id}=req.params;
    const {url}=req.body;
    if(id!=req.user.id){
        next(errorHandler(400,'Unauthorised User'));
        return;
    }
    try{
        const img=await new images ({
           imageUrl:url,
           owner:id
        });
        await img.save();
        res.status(200).json(img);
    }catch(err){
        next(err);
    }
}