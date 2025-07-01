import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { authField } from '../middlewares/authField.js';
import { authCrop} from  '../middlewares/authCrop.js'
import { authRevenue} from '../middlewares/authRevenue.js'
import { deleteRevenue, getAllRevenues, getParticularRevenue, newRevenue, updateRevenue } from '../controllers/RevenueController.js';
const router = express.Router(); 


router.post('/revenues/new_revenue', authUser, authField, authCrop, newRevenue);
router.get('/revenues/get_allRevenues', authUser, authField, authCrop, authRevenue, getAllRevenues); 
router.get('/revenues/get_particular_Revenue', authUser, authField, authCrop, authRevenue, getParticularRevenue); 
router.put('/revenues/updated_Revenue', authUser, authField, authCrop, authRevenue, updateRevenue)
router.delete('/revenues/delete_revenue', authUser, authField, authCrop, authRevenue, deleteRevenue)

export default router
