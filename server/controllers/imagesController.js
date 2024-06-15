import {errorHandler} from '../utils/errorHandler.js';
import images from '../models/imagesModel.js';
export const getImages=async(req,res,next)=>{
    const {id}=req.params;
    if(req.user.id!=id){
        next(400,'Not Allow to Get Images');
        return;
    }
    try {
        const userImages=await images.find({owner:id});
        res.status(200).json(userImages);
    } catch (err) {
        next(err);
    }
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
        const ans=[];
        garmentImgs.map(async(garmentImg)=>{
            const img=new images ({
                imageUrl:garmentImg,
                owner:id
            });
            await img.save();
            ans.push(img);
        });
        res.status(200).json(ans);
    }catch(err){
        next(err);
    }
}