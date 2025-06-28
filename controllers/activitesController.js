import { connect } from 'http2';
import client from '../config/database.js'
import jwt from 'jsonwebtoken'


export const newActivity = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fieldId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user) {
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
            res.status(400).json({message: 'field data not found, invalid fieldid'})
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
            res.status(400).json({message: 'crop data not found, invalid cropid'})
        }

        const { Activity_type,  description, quantity, unit, notes } = req.body; 

        if(!Activity_type  || !description || !quantity || !unit ){
            res.status(400).json({message: 'the given required to fill first'})
        }

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }): []
        
        const date = new Date(); 

        const newDate = date.setDate(date.getDate()); 

        const newActivity = await client.activites.create({
            data: {
                Activity_type, 
                startDate: newDate, 
                description, 
                quantity, 
                unit, 
                notes: Notes, 
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
                    connect:{
                        id: crop.id
                    }
                }
            }
        })

        const token = jwt.sign({id: newActivity.id}, process.env.JWT_SECRECT)

        res.status(200).json({token, newActivity,  message: 'new activity has been created successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const GetAllActivites = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fieldId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user) {
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
            res.status(400).json({message: 'field data not found, invalid fieldid'})
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
            res.status(400).json({message: 'crop data not found, invalid cropid'})
        }

        const GetAllActivites = await client.activites.findUnique({
            where: {
                userId: user.id,
                fieldId: field.id, 
                cropId: crop.id
            }
        })

        res.status(200).json({GetAllActivites, message: 'all the acitivites has been received! '})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const GetPariticularActivity = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const activityId = req.activity.id; 

        if(!userId || !fieldId || !cropId || !activityId){
            res.status(400).json({message: 'userId and fieldId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user) {
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
            res.status(400).json({message: 'field data not found, invalid fieldid'})
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
            res.status(400).json({message: 'crop data not found, invalid cropid'})
        }

        const activity = await client.activites.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: activityId
            }, 
            select: {
                id: true
            }
        })

        if(!activity){
            res.status(400).json({message: 'activity data not found, invalid activityId'})
        }

        const GetPariticularActivity = await client.activites.findUnique({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: activity.id
            }
        })

        res.status(200).json({GetPariticularActivity, message:'the particular activity has also been received!' })
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const UpdateActivity = async(req, res) => {

    try{
        
        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const activityId = req.activity.id; 

        if(!userId || !fieldId || !cropId || !activityId){
            res.status(400).json({message: 'userId and fieldId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user) {
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
            res.status(400).json({message: 'field data not found, invalid fieldid'})
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
            res.status(400).json({message: 'crop data not found, invalid cropid'})
        }

        const activity = await client.activites.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: activityId
            }, 
            select: {
                id: true
            }
        })

        if(!activity){
            res.status(400).json({message: 'Activity data not found, invalid acitiviyid'})
        }

        const {Activity_type, description, quantity, unit, notes} = req.body

        if(!Activity_type || !description || !quantity || !unit){
            res.status(400).json({message: 'fill the required data first'})
        }

        const date = new Date(); 

        const startDate = date.setDate(date.getDate())

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }): []
        

        const activity_data = await client.activites.update({
            where: {
                userId: user.id,
                fieldId: field.id,  
                cropId: crop.id, 
                id: activity.id
            }, data: {
                Activity_type, 
                description, 
                startDate: startDate, 
                quantity, 
                unit,
                notes: Notes
            }
        })

        if(!activity_data){
            res.status(400).json({message: 'activity data not received'})
        }

        res.status(200).json({activity_data, message: 'activity data has been received successfully'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const delteActivity = async(req, res) => {
    
    try{

        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        const activityId = req.activity.id; 

        if(!userId || !fieldId || !cropId || !activityId){
            res.status(400).json({message: 'userId and fieldId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user) {
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
            res.status(400).json({message: 'field data not found, invalid fieldid'})
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
            res.status(400).json({message: 'crop data not found, invalid cropid'})
        }

        const activity = await client.activites.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: activityId
            }, 
            select: {
                id: true
            }
        })

        if(!activity){
            res.status(400).json({message: 'activity not found, invalid activity id'})
        }

        const deleteParticularActivity = await client.activites.delete({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: activity.id
            }
        })

        if(!deleteParticularActivity){
            res.status(400).json({message: 'particular activity has not been deleted'})
        }

        res.status(200).json({deleteParticularActivity, message: 'particular acitivity has been successfully deleted'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}