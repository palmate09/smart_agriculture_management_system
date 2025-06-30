import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { authField } from '../middlewares/authField.js';
import { authCrop} from  '../middlewares/authCrop.js'
import { authActivity} from '../middlewares/authActivity.js'
import { deleteActivity, GetAllActivites, getAllLoggedActivites, GetPariticularActivity, newActivity, UpdateActivity } from '../controllers/activitesController.js';
const router = express.Router(); 


router.post('/activity/new_activity', authUser, authField, authCrop, newActivity)
router.get('/activity/get_all_acitivites', authUser, authField, authCrop, authActivity, GetAllActivites)
router.get('/activity/get_particular_activity', authUser, authField, authCrop, authActivity,  GetPariticularActivity)
router.put('/activity/update_activity', authUser, authField, authCrop, authActivity, UpdateActivity)
router.delete('/activity/delete_activity/:activityId',authUser, authField, authCrop, authActivity, deleteActivity)
router.get('/activity/get_all_logged_acitvites', authUser, getAllLoggedActivites)

export default router; 