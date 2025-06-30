import client from '../config/database.js'
import jwt from 'jsonwebtoken'
import { Priority, TaskStatus } from '../generated/prisma/index.js'


// creating the new Task associated to the particular crop which associated to the particular field and which associated to the paritcular user/farmer
export const newTask = async(req, res) => { 

    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fieldId and cropId is required to fill first '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop not found, invalid cropId'})
        }

        
        const { title, description, status, priority, dueDate } = req.body; 

        if(!title || !description || !status || !priority){
            res.status(400).json({message: 'all these data required to fill first'})
        }

        if(!Object.values(TaskStatus).includes(status)){
            res.status(400).json({message: 'Invalid task status provided'})
        }

        if(!Object.values(Priority).includes(priority)){
            res.status(400).json({message: 'Invalid priority data provided'})
        }

        const DueDate = new Date(dueDate)

        const newTask = await client.task.create({
            data: {
                title, 
                description, 
                status: status, 
                priority: priority, 
                dueDate: DueDate, 
                user: {
                    connect: {
                        id: user.id
                    }
                }, 
                field: {
                    connect: {
                        id: field.id
                    }
                }, 
                crop: {
                    connect: {
                        id: crop.id
                    }
                }
            }
        });

        const token = jwt.sign({id: newTask.id}, process.env.JWT_SECRECT)

        if(!token){
            res.status(400).json({message: 'token not found, or invalid Task id '})
        }

        res.status(201).json({token, message: 'new task has been created successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get all the Tasks associated to the particular crop which associated to the particular field and which is associated to the particular user/farmer
export const getAllTasks = async(req, res) => {

    try{
        
        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fieldId and cropId is required to fill first '})
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
            res.status(400).json({message: 'user not found, invalid userid'})
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
            res.status(400).json({message: 'crop not found, invalid cropId'})
        }


        const getAllTasks = await client.task.findMany({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id
            }
        })


        if(!getAllTasks){
            res.status(400).json({message: 'all tasks are not found'})
        }

        res.status(200).json({getAllTasks, message: 'all tasks has been successfully received!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get the particular task associated to the particular crop which associated to the particualer field and which is associated to the particular user/farmer
export const getParticularTask = async(req, res) => {

    try{
        
        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id
        const taskId = req.task.id

        if(!userId || !fieldId || !cropId || !taskId){
            res.status(400).json({message: 'userId and fieldId and cropId is required to fill first '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop not found, invalid cropId'})
        }

        const task = await client.task.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: taskId
            }
        })

        if(!task){
            res.status(400).json({message: 'taks not found, invalid taskid'})
        }

        const getParticularTask = await client.task.findUnique({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: task.id
            }
        })

        if(!getParticularTask){
            res.status(400).json({message: 'particular task has not been received'})
        }

        res.status(200).json({getParticularTask, message: 'particular task has been received successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// update the particular task associated to the particular crop which associated to the particular field and which is associated to the particular user/farmer
export const updateTask = async(req, res) => {

    try{
        
        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id
        const taskId = req.task.id

        if(!userId || !fieldId || !cropId || !taskId){
            res.status(400).json({message: 'userId and fieldId and cropId is required to fill first '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop not found, invalid cropId'})
        }

        const task = await client.task.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: taskId
            }
        })

        if(!task){
            res.status(400).json({message: 'taks not found, invalid taskid'})
        }

        const { description, status, priority, dueDate } = req.body;
        
        const updatedDate = new Date(dueDate);  

        const updatedTask = await client.task.update({
            where: {
                userId: user.id, 
                fieldId : field.id, 
                cropId: crop.id, 
                id: task.id
            }, 
            data: {
                description, 
                status, 
                priority, 
                dueDate: updatedDate, 
                user: {
                    connect: {
                        id: user.id, 
                    }
                }, 
                field: {
                    connect: {
                        id: field.id
                    }
                },
                crop: {
                    connect: {
                        id: crop.id
                    }
                }
            }
        }); 

        if(!updatedTask){
            res.status(400).json({message: "Task has not been updated"})
        }

        res.status(200).json({updatedTask, message: 'Task has been successfully updated'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// delete the particular task associated to the particular crop which associated to the particular field and which is associated to the particular user/farmer
export const deleteTask = async(req, res) => {
    
    try{
        
        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id
        const {taskId} = req.params; 

        if(!userId || !fieldId || !cropId || !taskId){
            res.status(400).json({message: 'userId and fieldId and cropId is required to fill first '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop not found, invalid cropId'})
        }

        const task = await client.task.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: taskId
            }
        })

        if(!task){
            res.status(400).json({message: 'taks not found, invalid taskid'})
        }

        const deleteTask = await client.task.delete({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: task.id
            }
        })

        if(!deleteTask){
            res.status(400).json({message: 'Task has not been deleted'})
        }

        res.status(200).json({message: 'Task has been successfully deleted! '})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get all looged  tasks associated to the user 
export const getallLoggedTasks = async(req, res) => {

    try{

        const userId = req.user.id; 

        if(!userId ){
            res.status(400).json({message: 'User id is required to fill first'})
        }

        const user  = await client.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userId '})
        }

        const getAllTask = await client.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                tasks: true
            }
        })

        if(!getAllTask){
            res.status(400).json({message: 'all logged task has not been received'})
        }

        res.status(200).json({getAllTask, message: 'all logged task has been received successfully! '})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}