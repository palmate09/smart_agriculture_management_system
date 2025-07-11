import express from 'express'
import { createField, deleteField, getallField, getParticularField, updateField } from '../controllers/fieldController.js';
import { authUser } from '../middlewares/authUser.js';
import { authField } from '../middlewares/authField.js';
const router = express.Router(); 

router.post('/fields/new_field',authUser, createField); 
router.get('/fields/get_all_fields', authUser, authField, getallField); 
router.get('/fields/get_particular_field', authUser, authField, getParticularField)
router.put('/fields/update_field', authUser, authField, updateField)
router.delete('/fields/delete_field/:fieldId', authUser, authField, deleteField); 


export default router; 