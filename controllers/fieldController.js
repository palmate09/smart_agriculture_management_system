import { error } from 'console';
import client from '../config/database.js'
import jwt from 'jsonwebtoken'

//particular user can create the field data
export const createField = async(req, res) => {

    try{

        const userId = req.user.id
        const { name, area, unit, location, notes } = req.body;
        
        if(!userId){
            res.status(400).json({message: 'User not found so fill the userId correctly'})
            return
        } 

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })


        if( !user ){
            res.status(400).json({message: 'User not found , invalid UserId'})
            return 
        }

        if( !name || !area || !unit || !location ){
            res.status(400).json({message: 'fill the required fields first'})
        }

        const notesData = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    return{
                        description: note?.description
                    }
                }
            }): []; 

        const FieldData =  await client.field.create({
            data: {
                name, 
                area, 
                unit, 
                location, 
                notes: {
                    create: notesData
                }, 
                user: {
                    connect: {id: user.id}
                }
            } 
        })

        const token = jwt.sign({id: FieldData.id}, process.env.JWT_SECRECT)

        res.status(201).json({token, message: 'filed data successfully has been created'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// all fields of particular user/farmer
export const getallField = async(req, res) => {

    try{

        const userId = req.user.id; 

        if( !userId ){
            res.status(400).json({message: 'fill the userId first'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user ){
            res.status(400).json({message: 'user not found, Invalid userid'})
        }

        const allFiledDetails = await client.user.findUnique({
            where: {
                id: user.id
            }, 
            select: {
                fields: true
            }
        })

        if(!allFiledDetails){
            res.status(400).json({message: 'all field details have not been received yet'})
        }

        res.status(200).json({allFiledDetails, message: 'all field details'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}


// particular field of particular user/farmer
export const getParticularField = async(req, res) => {

    try{

        const userId = req.user.id;
        const fieldId = req.field.id;
        
        if( !userId ){
            res.status(400).json({message: 'fill the userId first'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                id: true
            }
        })

        if(!user ){
            res.status(400).json({message: 'user not found, invalid user id'})
        }

        if(!fieldId ){
            res.status(400).json({message: 'fill the fieldId first '})
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
            res.status(400).json({message: 'field not found, invalid fieldid '})
        }

        const particularFieldData = await client.field.findUnique({
            where: {
                userId: user.id,
                id: field.id
            }
        })

        res.status(200).json({ particularFieldData, message: 'particular filed data is received'})
    }
    catch(e){
        res.status(500).json({error: e.message, message:'Internal server Error'})
    }
}

//update the particular filed data for the particular user/farmer
export const updateField = async (req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id; 

        if(!userId ){
            res.status(400).json({message: 'User id is required'})
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

        if(!fieldId){
            res.status(400).json({message: 'field id is required'})
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
            res.status(400).json({message: 'filed not found, invalid fieldid'})
        }


        const { location, notes, area, unit } = req.body; 

        if(!location || !area || !unit ){
            res.status(400).json({message: 'fill the required data first'})
        }

        const notesData = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    return{
                        description: note?.description
                    }
                }
            }): []; 

        const updatedData = await client.field.update({
            where: {
                userId: user.id, 
                id: field.id
            }, 
            data: {
                location, 
                notes: {
                    create: notesData
                }, 
                area, 
                unit
            }
        })

        res.status(200).json({ updatedData, message: 'field data has been updated successfully!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

//delete the particular field data for the particular user/farmer
export const deleteField = async(req, res) => {

    try{
        
        const userId = req.user.id; 
        const {fieldId} = req.params; 

        if(!userId ){
            res.status(400).json({message: 'User id is required'})
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

        if(!fieldId){
            res.status(400).json({message: 'field id is required'})
        }

        console.log(fieldId)
        console.log(userId)

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            },
            select: {
                id: true
            }
        })

        console.log(field)
        if(!field){
            res.status(400).json({message: 'filed not found, invalid fieldid'})
        }

        const filedData = await client.field.delete({
            where: {
                userId: user.id, 
                id: field.id
            }
        })

        res.status(200).json({filedData, message: 'field data is successfully deleted! '})
    }
    catch(e){
        res.status(400).json({error: e.message, message: 'Internal server Error'})
    }
}

