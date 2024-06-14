import express from 'express';
import { getImages, addImage } from '../controllers/imagesController.js';
import {verifyToken} from '../utils/isVerifyUser.js'

const router=express.Router();
 
router.get('/getImages',getImages);
router.post('/addImage/:id',verifyToken,addImage);

export default router;