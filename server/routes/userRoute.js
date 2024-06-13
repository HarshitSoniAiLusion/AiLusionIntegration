import express from 'express';
import { getUser ,setUserPrivacy } from '../controllers/userController.js'
import { verifyToken } from '../utils/isVerifyUser.js';

const router=express.Router();

router.get('/getUser/:id',getUser);
router.put('/setUserPrivacy/:id',verifyToken,setUserPrivacy)

export default router;