import client from '../config/database.js'
import { SourceRevenue } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'

// create a new Revenue associated to the crop and which associated to the field and which associated to the user/farmer
export const newRevenue = async(req, res) => {

    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId, fieldId and cropid is required'})
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
            res.status(400).json({message: 'user not found, invalid userId'})
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

        const crop = await client.crop. findFirst({
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

        const { amount, currency , source, description, notes, date } = req.body;
        
        if(!amount || !currency || !source || !description ){
            res.status(400).json({message: 'all these are required to fill first'})
        }

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }) : []

        if(!Object.values(SourceRevenue).includes(source)){
            res.status(400).json({message: 'Invalid revenue source received'})
        }


        const newdate = new Date(date)

        const newRevenue = await client.revenues.create({
            data: {
                amount, 
                currency, 
                date: newdate, 
                source: source, 
                description, 
                notes: {
                    create: Notes
                }, 
                user: {
                    connect : {
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

        if(!newRevenue){
            res.status(400).json({message: 'new Revenue details have not been added yet'})
        }

        const token = jwt.sign({id: newRevenue.id}, process.env.JWT_SECRECT)

        if(!token){
            res.status(400).json({message: 'token not found, Invalid newRevenueid'})
        }

        res.status(201).json({ token, message: 'new Revenue details have been successfully added'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get all Revenues associated to the crop and which associated to the field and which associated to the user/farmer
export const getAllRevenues = async(req, res) => {

    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId, fieldId and cropid is required'})
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
            res.status(400).json({message: 'user not found, invalid userId'})
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

        const crop = await client.crop. findFirst({
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

        const getAllRevenues = await client.revenues.findMany({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id
            }
        })

        if(!getAllRevenues){
            res.status(400).json({message: 'all revenues had not received yet'})
        }

        res.status(200).json({getAllRevenues, message: 'all revenues have been received successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get a particular Revenue associated to the revenues which associated to the particular crop and which associated to the particular field and which associated to the particular user/farmer 
export const getParticularRevenue = async(req, res) => {

    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id
        const revenueId = req.revenue.id

        if(!userId || !fieldId || !cropId || !revenueId){
            res.status(400).json({message: 'userId, fieldId and cropid and revenue is required'})
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
            res.status(400).json({message: 'user not found, invalid userId'})
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

        const crop = await client.crop. findFirst({
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

        const revenue = await client.revenues.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: revenueId
            },
            select: {
                id: true
            }
        })

        if(!revenue){
            res.status(400).json({message: 'revenue not found, invalid revenueId'})
        }

        const getParticularRevenue = await client.revenues.findUnique({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: revenue.id
            }
        })

        if(!getParticularRevenue){
            res.status(400).json({message: 'the particular revenue details have not been received yet'})
        }

        res.status(200).json({ getParticularRevenue, message: 'the particular revenue details have been successfully received!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// update a particular Revenue associated to the revenues which associated to the particular crop and which associated to the particular field and which associated to the particular user/farmer
export const updateRevenue = async(req, res) => {

    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id
        const revenueId = req.revenue.id

        if(!userId || !fieldId || !cropId || !revenueId){
            res.status(400).json({message: 'userId, fieldId and cropid and revenue is required'})
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
            res.status(400).json({message: 'user not found, invalid userId'})
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

        const crop = await client.crop. findFirst({
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

        const revenue = await client.revenues.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: revenueId
            },
            select: {
                id: true
            }
        })

        if(!revenue){
            res.status(400).json({message: 'revenue not found, invalid revenueId'})
        }

        const { amount, currency, source, description, notes, date } = req.body;
        
        if(!amount || !currency || !source || !description ){
            res.status(400).json({message: 'all this data is required to fill first'})
        }

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }) : []

        if(!Object.values(SourceRevenue).includes(source)){
            res.status(400).json({message: 'Invalid revenue source provided'})
        }

        const newDate = new Date(date)

        const updatedRevenue = await client.revenues.update({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: revenue.id
            }, 
            data: {
                amount, 
                currency, 
                date: newDate, 
                source: source, 
                description, 
                notes: {
                    create: Notes
                }
            }
        })

        if(!updatedRevenue){
            res.status(400).json({message: 'the revenue details have not been updated yet'})
        }

        res.status(200).json({ updatedRevenue, message: 'the revenue details have been updated successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// delete a particular Revenue assicated to the revenues which associated to the particular crop and which assicated to the particular field and which associated to the particular user/farmer
export const deleteRevenue = async(req, res) => {

    
    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id
        const revenueId = req.revenue.id

        if(!userId || !fieldId || !cropId || !revenueId){
            res.status(400).json({message: 'userId, fieldId and cropid and revenue is required'})
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
            res.status(400).json({message: 'user not found, invalid userId'})
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

        const crop = await client.crop. findFirst({
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

        const revenue = await client.revenues.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: revenueId
            },
            select: {
                id: true
            }
        })

        if(!revenue){
            res.status(400).json({message: 'revenue not found, invalid revenueId'})
        }

        const deleteRevenue = await client.revenues.delete({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                cropId: crop.id, 
                id: revenue.id
            }
        })

        if(!deleteRevenue){
            res.status(400).json({message: 'revenue details have not been deleted yet'})
        }

        res.status(200).json({message: 'revenue details have been deleted successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}