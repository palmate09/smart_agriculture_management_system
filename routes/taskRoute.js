import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { authField } from '../middlewares/authField.js';
import { authCrop} from  '../middlewares/authCrop.js'
import { authTask} from '../middlewares/authTask.js'
import { deleteTask, getallLoggedTasks, getAllTasks, getParticularTask, newTask, updateTask } from '../controllers/TaskController.js';

const router = express.Router(); 


router.post('/tasks/new_task', authUser, authField, authCrop, newTask)
router.get('/tasks/get_all_tasks', authUser, authField, authCrop, authTask, getAllTasks)
router.get('/tasks/get_particular_task', authUser, authField, authCrop, authTask, getParticularTask)
router.put('/tasks/update_task', authUser, authField, authCrop, authTask, updateTask)
router.delete('/tasks/delete_task/:taskId', authUser, authField, authCrop, authTask, deleteTask)
router.get('/tasks/getAllLogged_tasks', authUser, getallLoggedTasks);

export default router; 