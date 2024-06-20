import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isSubscribed:{
        startTime:{
            type:Date,
        },
        endTime:{
            type:Date,
        },
        totalTrials:{
            type:Number,
        },
        trialUses:{
            type:Number,
        },
        trialRemaining:{
            type:Number,
        }
    },
    isPrivacyChecked:{
        type:Boolean,
        default:false
    },
    freeTrial:{
        type:Number,
        default:3
    },
    subscribedMailSendAt:{
        type:Date,
    }
},{timestamps:true});

const user=mongoose.model('user',userSchema);

export default user;