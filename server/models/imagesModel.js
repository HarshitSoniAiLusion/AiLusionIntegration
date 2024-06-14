import mongoose, { Schema } from 'mongoose'

const imageSchema=new mongoose.Schema({
    imageUrl:{
        type:String,
        required:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
},{timestamps:true});

const images=mongoose.model('images',imageSchema);

export default images;