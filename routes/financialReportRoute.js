import express from 'express'
import {authUser} from '../middlewares/authUser.js'
import {CategoryExpense, getProfit_lossReport, revenue_by_source} from '../controllers/financialReportController.js'
const router = express.Router(); 

router.get('/financial/reports/profit-loss', authUser, getProfit_lossReport)
router.get('/financial/reports/expense-by-category', authUser, CategoryExpense)
router.get('/financial/reports/revenue_by_source', authUser, revenue_by_source)

export default router; 