import client from '../config/database.js'
import jwt from 'jsonwebtoken'
import { ExpenseDetailType, Method } from '../generated/prisma/index.js';

// create the new Expense associated to the particular crop and which associated to the particular field and which associated to the particular user/farmer
export const newExpense = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id
        const cropId = req.crop.id

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: "userId and fieldId and cropId are required to fill"})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: "user not found, invalid userId "})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop not found invalid crop'})
        }

        const { amount, currency, notes, category, description, paymentMethod, vendor, receiptNumber, date } = req.body; 

        if(!amount || !currency || !category || !description || !paymentMethod || !vendor || !receiptNumber){
            res.status(400).json({message: 'all these field are required to fill first'})
        }

        if(!Object.values(ExpenseDetailType).includes(category)){
            res.status(400).json({message: 'Invalid Expense category provided'})
        }

        if(!Object.values(Method).includes(paymentMethod)){
            res.status(400).json({message: 'Invalid payment method provided'})
        }

        const newDate = new Date(date)

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }) : []
        
        const newExpense = await client.expenses.create({
            data: {
                amount, 
                currency, 
                notes: {
                    create: Notes
                }, 
                category: category, 
                date: newDate, 
                description, 
                paymentMethod: paymentMethod, 
                vendor, 
                receiptNumber, 
                user: {
                    connect: {
                        id: user.id
                    }
                }, 
                Field: {
                    connect: {
                        id: field.id
                    }
                }, 
                Crop: {
                    connect: {
                        id: crop.id
                    }
                }
            }
        })

        if(!newExpense){
            res.status(400).json({message: 'the new expense has not been created'})
        }

        const token = jwt.sign({id: newExpense.id}, process.env.JWT_SECRECT) 

        if(!token){
            res.status(400).json({message: 'token has not generated yet'})
        }

        res.status(200).json({token, message: 'the new expense has been created successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get all the expenses associated to the particular crop and which associated to the particular field and  which associated to the particular user/farmer
export const getAllExpenses = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id
        const cropId = req.crop.id

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: "userId and fieldId and cropId are required to fill"})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: "user not found, invalid userId "})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop not found invalid crop'})
        }

        const getAllExpenses = await client.expenses.findMany({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id
            }, 
            include: {
                details: true
            }
        })
        
        if(!getAllExpenses){
            res.status(400).json({message: 'all the expenses have not been received'})
        }

        res.status(200).json({ getAllExpenses, message: 'all the expenses have been successfully received!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get particular expense associated to the particular crop and which associated to the particular field and which associated to the particular user/farmer 
export const getParticularExpense = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id
        const cropId = req.crop.id
        const ExpenseId = req.Expense.id

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: "userId and fieldId and cropId and ExpenseId are required to fill"})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: "user not found, invalid userId "})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop details not found invalid cropid'})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: ExpenseId
            }, 
            select: {
                id: true
            }
        })

        if(!Expense){
            res.status(400).json({message: 'Expense details not found, invalid ExpenseId'})
        }


        const getParticularExpense = await client.expenses.findUnique({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: Expense.id
            }
        })

        if(!getParticularExpense){
            res.status(400).json({message: 'the particular expense has not been received successfully'})
        }

        res.status(200).json({ getParticularExpense, message: 'the particular Expense has been received successfully'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// update particular expense associated to the particular crop and which associated to the particular field and which associated to the particular user/farmer
export const updateExpense = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id
        const cropId = req.crop.id
        const ExpenseId = req.Expense.id

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: "userId and fieldId and cropId and ExpenseId are required to fill"})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: "user not found, invalid userId "})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop details not found, invalid cropId'})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: ExpenseId
            }, 
            select: {
                id: true
            }
        })

        if(!Expense){
            res.status(400).json({message: 'Expense details not found, Invalid ExpenseId '})
        }

        const { amount, currency, category, description, notes, date } = req.body; 

        if(!amount || !currency || !category || !description){
            res.status(400).json({message: 'these data are required to fill first'})
        }

        const newdate = new Date(date);  

        if(!Object.values(ExpenseDetailType).includes(category)){
            res.status(400).json({message: 'Invalid Expense Category provided'})
        }

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }) : []

        const updatedExpense = await client.expenses.update({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: Expense.id
            }, 
            data: {
                amount, 
                currency, 
                date: newdate, 
                category: category, 
                description, 
                date: newdate,
                notes: {
                    create: Notes
                },
                user: {
                    connect: {
                        id: user.id
                    }
                }, 
                Field: {
                    connect: {
                        id: field.id
                    }
                }, 
                Crop: {
                    connect: {
                        id: crop.id
                    }
                }   
            }
        })

        if(!updatedExpense){
            res.status(400).json({message: 'expense has not been updated'})
        }

        res.status(200).json({ updatedExpense, message: 'expense has been updated successfully'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// deleted the particular expense associted to the particular crop and which associated ot the particular field and which associated to the particular user/farmer
export const deleteExpense = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id
        const cropId = req.crop.id
        const {ExpenseId} = req.params

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: "userId and fieldId and cropId and ExpenseId are required to fill"})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: "user not found, invalid userId "})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop details not found , invalid cropId '})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id,
                cropId: crop.id, 
                id: ExpenseId
            }, 
            select: {
                id: true
            }
        })

        if(!Expense){
            res.status(400).json({message: 'Expense details not found,  invalid ExpenseId '})
        }

        const deleteExpense = await client.expenses.delete({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: Expense.id
            }
        })

        if(!deleteExpense){
            res.status(400).json({message: 'Expense details are not deleted '})
        }

        res.status(200).json({ deleteExpense, message: 'Expense details have been deleted successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// add the expense detail associated to the particular expense which associated to the particular crop which associated to the particular field which associated to the particular user/farmer
export const addExpenseDetails = async(req, res ) => {

    try{
        
        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const ExpenseId = req.Expense.id; 

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: 'userId and fieldId and cropId and ExpenseId are required '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userId'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field data  not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id,
                id:ExpenseId
            }, 
            select: {
                id: true
            }
        })

        if(!Expense){
            res.status(400).json({message: 'Expense data not found, invalid ExpenseId'})
        }

        const { type, detailsJson }  =req.body;

        if(!type || !detailsJson){
            res.status(400).json({message: 'the give fields are required to fill first'})
        }

        if(!Object.values(ExpenseDetailType).includes(type)){
            res.status(400).json({message: 'Invalid provided expense detail type '})
        }
        
        const addExpenseDetails = await client.expenseDetail.create({
            data: {
                type: type, 
                detailsJson, 
                expense: {
                    connect: {
                        id: Expense.id
                    }
                }
            }
        })

        if(!addExpenseDetails){
            res.status(400).json({message: 'expense details have not been added yet'})
        }

        res.status(200).json({ addExpenseDetails, message: 'expense details have been successfully added'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get the expense details associated to the particular expense which associated to the particular crop which associated to the particular field and whcih associated to the particular user/farmer
export const getExpenseDetails = async(req, res ) => {

    try{
        
        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const ExpenseId = req.Expense.id; 

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: 'userId and fieldId and cropId and ExpenseId are required '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userId'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field data  not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id,
                id:ExpenseId
            }, 
            select: {
                id: true
            }
        })

        if(!Expense){
            res.status(400).json({message: 'Expense data not found, invalid ExpenseId'})
        }

        const getExpenseDetails = await client.expenseDetail.findUnique({
            where: {
                expenseId: Expense.id
            }
        })

        if(!getExpenseDetails){
            res.status(400).json({message: 'Expense details have not been recieved yet'})
        }
        
        res.status(200).json({ getExpenseDetails, message: 'Expense details have been successfully received'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// update the expense details associated to the particular expense which associated to the particular crop which associated to the particular field and which associated to the particular user/farmer 
export const updateExpenseDetails = async(req, res) => {

    try{
        
        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const ExpenseId = req.Expense.id; 

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: 'userId and fieldId and cropId and ExpenseId are required '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userId'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field data  not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id,
                id:ExpenseId
            }, 
            select: {
                id: true
            }
        })

        if(!Expense){
            res.status(400).json({message: 'Expense data not found, invalid ExpenseId'})
        }

        const { type, detailsJson } = req.body;
        
        if(!type || !detailsJson){
            res.status(400).json({message: 'the given field are required'})
        }

        if(!Object.values(ExpenseDetailType).includes(type)){
            res.status(400).json({message: 'Invalid expense detail type provided'})
        }

        const updatedExpense = await client.expenseDetail.update({
            where: {
                expenseId: Expense.id
            }, 
            data: {
                type: type, 
                detailsJson, 
                expense: {
                    connect: {
                        id: Expense.id
                    }
                }
            }
        })

        if(!updatedExpense){
            res.status(400).json({message: 'Expense details has not been updated yet '})
        }

        res.status(200).json({ updatedExpense, message: 'Expense details has been successfully updated'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// delete the expense detaisl associated to the particular expense which associated to the particular crop and which associated to the particular field and which associated to the particular user/farmer
export const deleteExpenseDetails = async(req, res) => {

    try{
        
        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const ExpenseId = req.Expense.id; 

        if(!userId || !fieldId || !cropId || !ExpenseId){
            res.status(400).json({message: 'userId and fieldId and cropId and ExpenseId are required '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userId'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }, 
            select: {
                id: true
            }
        })

        if(!field){
            res.status(400).json({message: 'field data  not found, invalid fieldId'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }, 
            select: {
                id: true
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const Expense = await client.expenses.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id,
                id:ExpenseId
            }, 
            select: {
                id: true
            }
        })


        if(!Expense){
            res.status(400).json({message: 'Expense data not found, invalid ExpenseId'})
        }

        const deleteExpenseDetails = await client.expenseDetail.delete({
            where: {
                expenseId: Expense.id
            }
        })

        if(!deleteExpenseDetails){
            res.status(400).json({message: 'the Expense data has not been deleted yet'})
        }

        res.status(200).json({message: 'the expense details has been successfully deleted'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}
