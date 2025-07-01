import express from 'express'
import { authUser} from '../middlewares/authUser.js'
import { authField} from '../middlewares/authField.js'
import { authCrop} from '../middlewares/authCrop.js'
import { authExpense} from '../middlewares/authExpense.js'
import { addExpenseDetails, deleteExpense, deleteExpenseDetails, getAllExpenses, getExpenseDetails, getParticularExpense, newExpense, updateExpense, updateExpenseDetails } from '../controllers/ExpenseController.js'
const router = express.Router(); 


router.post('/expenses/new_Expense', authUser, authField, authCrop, newExpense); 
router.get('/expenses/get_all_expenses', authUser, authField, authCrop, authExpense, getAllExpenses); 
router.get('/expenses/get_particular_expense', authUser, authField, authCrop, authExpense, getParticularExpense); 
router.put('/expenses/update_Expenses', authUser, authField, authCrop, authExpense, updateExpense); 
router.delete('/expenses/delete_Expenses/:ExpenseId', authUser, authField, authCrop, authExpense, deleteExpense)
router.post('/expenses/add_expenseDetails', authUser, authField, authCrop, authExpense, addExpenseDetails)
router.get('/expenses/get_ExpenseDetails', authUser, authField, authCrop, authExpense, getExpenseDetails)
router.put('/expenses/update_ExpenseDetails', authUser, authField, authCrop, authExpense, updateExpenseDetails)
router.delete('/expenses/delete_ExpenseDetails', authUser, authField, authCrop,  authExpense, deleteExpenseDetails)



export default router; 