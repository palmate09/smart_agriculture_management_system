import client from '../config/database.js'


export const dashboard_summery = async(req, res) => {
    try{
        
        const userId = req.user.id; 

        if(!userId){
            res.status(400).json({message: 'userId is not received'})
        }

        const summery = await client.crop.groupBy({
            where: {
                userId: userId
            }, 
            by:['status'], 
            _count: {
                id: true
            }
        })

        const activeCropCount = summery
            .filter(item => item.status !== 'ABANDONED')
            .reduce((acc, curr) => acc + curr._count.id, 0)

        
        const tasks = await client.task.findMany({
            where: {
                userId: userId
            }, 
            select: {
                id: true, 
                title: true,  
                dueDate: true,
                status: true
            }
        })

        const customOrder = ['INPROGRESS', 'OVERDUE', 'PENDING']

        const sortedupcomingTasks = tasks.sort((a,b) => {
            return customOrder.indexOf(a.status) - customOrder.indexOf(b.status)
        })
        
        const upcomingTasks = sortedupcomingTasks[0]

        while( upcomingTasks.length <= 4 ){
            res.status(200).json({ activeCropCount, upcomingTasks })
        }
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const crop_Growth_overview = async(req, res) => {
    try{

        const userId = req.user.id; 

        if(!userId){
            res.status(400).json({message: 'userId not received'})
        }

        const crops =  await client.crop.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true, 
                name: true, 
                status: true
            }
        })

        const ans = crops.filter((item) => item.status !== 'ABANDONED')
        
        const ActiveCrop = ans[0]

        const result = await client.cropGrowthStage.groupBy({
            where: {
                cropId: crops[0].id
            }, 
            by: ['stageName']
        })

        const cropGrowthStage = result[0].stageName

        while(ActiveCrop.length && cropGrowthStage.length <= 4){
            res.status(200).json({ActiveCrop, cropGrowthStage})
        }
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const Task_overview = async(req, res) => {

    try{

        const userId = req.user.id; 

        if(!userId){
            res.status(400).json({message: 'userId is not received yet'})
        }

        const taskOverview = await client.task.findMany({
            where: {
                userId: userId
            }, 
            select: {
                id: true, 
                title: true,
                status: true 
            }
        })

        while(taskOverview.length <= 4){
            res.status(200).json({ taskOverview })
        }
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const activity_overview = async(req, res) => {

    try{

        const userId = req.user.id; 

        if( !userId ){
            res.status(400).json({message: 'userId is not received'})
        }

        const activityOverview = await client.activites.findMany({
            where: {
                userId: userId
            },
            select: {
                id: true, 
                Activity_type: true, 
                startDate: true, 
                cropId: true
            }
        })

        while(activityOverview.length <= 4){
            res.status(200).json({activityOverview})
        }
    }   
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const Financial_overview = async(req, res) => {

    try{

        const userId = req.user.id; 

        if(!userId){
            res.status(200).json({message: 'userId not received'})
        }

        const expenses = await client.expenses.findMany({
            where: {
                userId: userId
            }, 
            select: {
                id: true, 
                amount: true, 
                currency: true, 
                date: true, 
                category: true
            }
        })

        const revenue = await client.revenues.findMany({
            where: {
                userId: userId
            }, 
            select: {
                id: true, 
                amount: true, 
                currency: true, 
                date: true,
                source: true
            }
        })

        while(expenses.length && revenue.length <= 4){
            res.status(200).json({expenses, revenue})
        }
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}