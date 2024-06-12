import express from 'express'
import signupRoute from './routes/userRoute.js'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const app=express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log('AiLusion Database is Connected');
}).catch((err)=>{
    console.log(err);
})

app.listen(8080,()=>{
    console.log('Server is Listening at the Port 8080');
});

app.use('/api/auth',signupRoute);


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        message:message,
        statusCode
    });
})