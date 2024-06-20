// imageProcessor.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

export const getTryOn = async (req) => {

  const humanFile=req.files['human_Img'][0].path;
  const garmentFile=req.files['garment_Img'][0].path;
  const __dirname = path.resolve();
  let data = new FormData();

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

  try {
    const response = await axios.request(config);
    fs.writeFileSync(filePath, response.data);
    console.log('Image saved as', filePath);

    // Clean up the uploaded files
    fs.unlinkSync(humanFile); 
    fs.unlinkSync(garmentFile); 

    // Construct image URL
    const imageUrl = `${req.protocol}://localhost:8080/public/output_image.jpeg?timestamp=${new Date().getTime()}`;

    return imageUrl;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

