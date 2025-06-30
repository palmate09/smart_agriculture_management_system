import express from 'express'
import {authUser} from '../middlewares/authUser.js'
import { authField } from '../middlewares/authField.js'
import { authCrop} from  '../middlewares/authCrop.js'
import { CropGrowthStage, DeleteCrop, deleteGrowthStage, get_allCrops_ofParticularFramer, getCropGrowthStage, getParticularCrop, new_crop, updateCropAfterHarvesting, updateGrowthStage } from '../controllers/CropController.js';
const router = express.Router();


router.post('/crops/new_crop', authUser, authField, new_crop); 
router.get('/crops/get_all_crops', authUser, authField, authCrop, get_allCrops_ofParticularFramer); 
router.get('/crops/get_particular_crop', authUser, authField, authCrop, getParticularCrop); 
router.put('/crops/update_crop_afterHarvesting', authUser, authField, authCrop, updateCropAfterHarvesting); 
router.delete('/crops/delete_crop/:cropId', authUser, authField, authCrop, DeleteCrop)
router.post('/crops/crop_growth_stage', authUser, authField, authCrop, CropGrowthStage)
router.get('/crops/crop_growth_stage', authUser, authField, authCrop, getCropGrowthStage)
router.put('/crops/update_crop_growth_stage/:crpgwthId', authUser, authField, authCrop, updateGrowthStage)
router.delete('/crops/delete_crop_growth_stage', authUser, authField, authCrop, deleteGrowthStage)

export default router; 