import express from 'express';
import { SignOutUser, getUser ,setUserPrivacy , subscribeUser } from '../controllers/userController.js'
import { verifyToken } from '../utils/isVerifyUser.js';

const router=express.Router();

router.get('/getUser/:id',getUser);
router.put('/setUserPrivacy/:id',verifyToken,setUserPrivacy);
router.patch('/subscribe/:id',verifyToken,subscribeUser);
router.post('/signOut',verifyToken,SignOutUser);

export default router;