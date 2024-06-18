import express from 'express';
import { tryOn } from '../controllers/gpuController.js';
import {verifyToken} from '../utils/isVerifyUser.js'
import multer from 'multer';

const router=express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      // Use the original file name with a timestamp to avoid overwriting
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  });

const upload = multer({ storage: storage });

router.post('/tryOn/:id',verifyToken,upload.fields([{ name: 'human_Img' }, { name: 'garment_Img' }]),tryOn);


export default router;