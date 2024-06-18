import { errorHandler } from "../utils/errorHandler.js";
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export const tryOn=async(req,res,next)=>{
    if(req.user.id!=req.params.id)return next(errorHandler(400,'Unauthorised user'));
     
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