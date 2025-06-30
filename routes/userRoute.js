import express from 'express'
import { forgotpassrequest, forgotpassword, getprofile, login, signup, updateProfile } from '../controllers/UserControllers.js';
import { LoginLimiter } from '../middlewares/rateLimitier.js';
import { authUser } from '../middlewares/authUser.js';
const router = express.Router();

router.post('/users/signup', signup); 
router.post('/users/login', LoginLimiter, login)
router.get('/users/profile', authUser, getprofile)
router.put('/users/profile', authUser, updateProfile)
router.post('/users/forgot-password', authUser, forgotpassrequest)
router.put('/users/forgot-password/:token', authUser, forgotpassword)


export default router; 