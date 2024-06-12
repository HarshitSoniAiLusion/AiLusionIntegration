import express, { Router } from 'express';
import { signup ,signin, googleAuth } from '../controllers/userController.js';

const router=express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',googleAuth);

export default router;