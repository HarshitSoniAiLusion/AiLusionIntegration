import express from 'express'
import signupRoute from './routes/authRoute.js'
import getUserRoute from './routes/userRoute.js'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser  from 'cookie-parser'
import imagesRoute from './routes/imagesRoute.js'
import gpuRoute from './routes/gpuRoute.js'
import path from 'path';

dotenv.config();

const app=express();
app.use(express.json());
app.use(cookieParser());
const __dirname=path.resolve();

app.use('/public', express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log('AiLusion Database is Connected');
}).catch((err)=>{
    console.log(err);
})

app.listen(8080,()=>{
    console.log('Server is Listening at the Port 8080');
});

app.use('/api/auth',signupRoute);
app.use('/api/user',getUserRoute);
app.use('/api/images',imagesRoute);
app.use('/api/gpu',gpuRoute);


app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message=err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success:false,
        message:message,
        statusCode
    });
})
