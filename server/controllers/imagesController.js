import {errorHandler} from '../utils/errorHandler.js'
import images from '../models/imagesModel.js'
export const getImages=(req,res,next)=>{
    res.send('You got the images');
}

export const addImage=async(req,res,next)=>{
    console.log(req.body);
    const {id}=req.params;
    const garmentImgs=req.body;
    if(garmentImgs.length<=0){
        next(500,'URL is Required');
        return;
    }
    if(id!=req.user.id){
        next(errorHandler(400,'Unauthorised User'));
        return;
    }
    try{
        garmentImgs.map(async(garmentImg)=>{
            const img=new images ({
                imageUrl:garmentImg,
                owner:id
            });
            await img.save();
        });
        res.status(200).json(img);
    }catch(err){
        next(err);
    }
}