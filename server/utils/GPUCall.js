import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import {fileTypeFromBuffer} from "file-type";;



export default function GetTryOn(humanFile,garmentFile) {
  let data = new FormData();
  const __dirname=path.resolve();

  data.append('cloth_image', fs.createReadStream('/images/t-shirt.jpeg'));
  data.append('human_image', fs.createReadStream('/images/man.jpg'));

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
    // const filePath = path.join(__dirname, 'output_image.jpeg');
    fs.writeFileSync(filePath, response.data);
    console.log(response.data);
     console.log('Image saved as', filePath);
  })
  .catch((error) => {
    console.log(error);
  });
}

