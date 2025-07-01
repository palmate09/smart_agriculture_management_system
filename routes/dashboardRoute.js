import express from 'express'
import {authUser} from '../middlewares/authUser.js'
import { activity_overview, crop_Growth_overview, dashboard_summery, Financial_overview, Task_overview } from '../controllers/dashboardController.js';
const router = express.Router(); 


router.get('/dashboard/summary', authUser, dashboard_summery); 
router.get('/dashboard/crop-growth-overview', authUser, crop_Growth_overview); 
router.get('/dashboard/task-overview', authUser, Task_overview); 
router.get('/dashboard/activity-overview', authUser, activity_overview); 
router.get('/dashboard/financial-overview', authUser, Financial_overview); 


export default router