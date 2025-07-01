import client from '../config/database.js'


// issue :- here i am not converting the expense according to the different currency it means it will accept only the INR
export const getProfit_lossReport = async(req, res) => {

    try{
        
        const userId = req.user.id;
        

        if(!userId){
            res.status(400).json({message: 'userId is not received'})
        }


        const totalExpense = await client.expenses.aggregate({
            _sum: {
                amount: true
            }, 
            where: {
                userId: userId
            }
        })


        const totalRevenue = await client.revenues.aggregate({
            where: {
                userId: userId
            },
            _sum: {
                amount: true
            }
        })

        const result = totalRevenue._sum.amount - totalExpense._sum.amount

        if(result > 0){
            res.status(200).json({ message: `The profit is :- ${result} INR `})
        }
        else if (result = 0){
            res.status(200).json({message: 'No loss and No profit'})
        }
        else{
            res.status(200).json({message: `The loass is :- ${result}`})
        }
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// same isssue here also 
export const CategoryExpense = async(req, res) => {

    try{
        
        const userId = req.user.id; 

        if(!userId){
            res.status(400).json({message: 'userId not received'})
        }

        const expenseByCategory = await client.expenses.groupBy({
            where: {
                userId: userId
            }, 
            by: ['category'], 
            _sum: {
                amount: true
            }
        })

        const result = expenseByCategory[0]?._sum.amount

        if(!result){
            res.status(400).json({message: 'result not found'})
        }

        res.status(200).json({ message: `The Expense by category is:- ${result} INR`})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// same issue here also 
export const revenue_by_source = async(req, res) => {
    
    try{
        
        const userId = req.user.id; 

        if(!userId ){
            res.status(400).json({message: 'UserId is not received'})
        }

        const revenueBySource = await client.revenues.groupBy({
            where: {
                userId: userId
            }, 
            by: ['source'], 
            _sum: {
                amount: true
            }
        })


        const result = revenueBySource[0]?._sum.amount

        if(!result){
            res.status(400).json({message: 'revenue by source is not received'})
        }

        res.status(200).json({message: `revenue by source is : - ${result} INR`})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}