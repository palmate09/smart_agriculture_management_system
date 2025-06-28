import client from '../config/database.js'
import jwt from 'jsonwebtoken'

// create the new crop detail by the particular user 
export const new_crop = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id;
        
        if(!userId && !fieldId){
            res.status(400).json({message: 'userid and fieldid is required'})
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
                id: fieldId
            }
        })
        
        if(!field){
            res.status(400).json({message: 'field not found, invalid fieldid'})
        }

        const { name, variety, plantingDate, expectedHarvestingDate,  status, yieldAmount, yieldUnit, notes } = req.body; 

        if(!name || !variety || !plantingDate || !expectedHarvestingDate  || !status || !yieldAmount || !yieldUnit){
            res.status(400).json('fill these required field first ')
            return; 
        }

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }): []
        
        const date = new Date(); 

        const Plantingdate = date.setDate(date.getDate()); 
        const expected_harvestingDate = date.setDate(date.getDate() + 100);

        const newCrop = await client.crop.create({
            data: {
                name,
                variety, 
                plantingDate: Plantingdate, 
                expectedHarvestingDate: expected_harvestingDate, 
                status,
                yieldAmount, 
                yieldUnit,
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
                }
            }
        })

        const token = jwt.sign({id: newCrop.id}, process.env.JWT_SECRECT); 
        res.status(201).json({token, message: 'Crop details successfully has been stored'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get the all crops details associated to the particular user; 
export const get_allCrops_ofParticularFramer = async (req, res) => {

    try{

        const userId = req.user.id;
        const fieldId = req.field.id; 

        if(!userId && !fieldId){
            res.status(400).json({message: 'user not found so fill the correct userid '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user) {
            req.status(400).json({message: 'user not found, Invalid userId '})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id,
                id: fieldId
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found so fill the correct fieldid'})
        }

        const CropDetails = await client.crop.findUnique({
            where: {
                userId: user.id, 
                fieldId: field.id
            }
        })

        res.status(200).json({CropDetails, message: 'Crop details found'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get the particular crops details associated to the particular user
export const getParticularCrop = async(req, res) => {

    try{

        const userId = req.user.id;
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 

        if(!userId && !fieldId && !cropId){
            res.status(400).json({message: 'user not found so fill the correct userid '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user) {
            req.status(400).json({message: 'user not found, Invalid userId '})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id,
                id: fieldId
            }
        })

        if(!field){
            res.status(400).json({message: 'field not found so fill the correct fieldid'})
        }

        const crop = await client.crop.findFirst({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: cropId
            }
        })

        if(!crop){
            res.status(400).json({message: "crop data not found so fill the correct cropid"})
        }

        const CropDetails = await client.crop.findUnique({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: crop.id
            }
        })

        res.status(200).json({CropDetails, message: 'Crop details found'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// update the particular crop details after it is harvested which is associated to the particular user and also associated to the particular field
export const updateCropAfterHarvesting = async(req, res) => {

    try{

        const userId = req.user.id
        const fieldId = req.field.id; 
        const cropId = req.crop.id;

        if(!userId && !fieldId && !cropId){
            res.status(400).json({message: 'userId and fieldId and cropId is requried '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userid '})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }
        })

        if(!field){
            res.status(400).json({message: "field not found, invalid fieldid"})
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

        const {  actualHarvestingDate, status , notes} = req.body; 

        if(  !actualHarvestingDate || !status  ){
            res.status(400).json({message: 'fill the required data first '})
        }

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }): []
        
        const date = new Date();
        
        const Acutal_harvestingDate  = date.setDate(date.getDate()); 


        const cropDetails = await client.crop.update({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: crop.id
            }, 
            data: {
                actualHarvestingDate: Acutal_harvestingDate, 
                status, 
                notes: Notes
            }
        })
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// delete the particular crop details associated to the particular user/farmer and also associated to the particular field
export const DeleteCrop = async(req, res) => {

    try{

        const userId = req.user.id
        const fieldId = req.field.id
        const cropId = req.crop.id;
        
        if(!userId && !fieldId && !cropId){
            res.status(400).json({message: 'userId and fieldId and cropId is requried '})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user not found, invalid userid '})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
            }
        })

        if(!field){
            res.status(400).json({message: "field not found, invalid fieldid"})
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

        const cropDetails = await client.crop.delete({
            where: {
                userId: user.id, 
                fieldId: field.id, 
                id: crop.id
            }
        })

        res.status(200).json({cropDetails, message: 'crop details has been successfully deleted'})
        
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// add  the cropGrowth stage associated to the particular crop which associated to the particular field and which associated to the particular user/farmer 
export const CropGrowthStage = async(req, res) => {

    try{

        const userId = req.user.id; 
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 
        
        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fileId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const { stageName, notes } = req.body; 

        const date = new Date(); 

        const DateObserved = date.setDate(date.getDate())

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }) : []

        const cropGrowthStage_details = await client.cropGrowthStage.create({
            data: {
                stageName, 
                dateObserved: DateObserved, 
                notes: Notes, 
                crop: {
                    connect: {
                        id: crop.id
                    }
                }
            }
        })

        res.status(200).json({cropGrowthStage_details, message: 'crop growth stage details are stored successfully!'})

    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// get the cropGrowth stage associated to the particular crop which associated to the particular field and which associated to the particular user/farmer
export const getCropGrowthStage = async(req, res) => {

    try{

        const userId = req.user.id;
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fileId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const getCropGrowthStage = await client.cropGrowthStage.findUnique({
            where: {
                cropId: crop.id
            }
        })

        res.status(200).json({getCropGrowthStage, message: 'crop growth stage details has been successfully received!'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// update the cropGrowth stage associated to the particular crop which associated to the particular fiedl and which associated to the particular user/farmer
export const updateGrowthStage = async(req, res) => {

    try{

        const userId = req.user.id;
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fileId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const { crpgwthId } = req.params; 
        const { stageName, notes } = req.body; 

        const Notes = Array.isArray(notes)
            ? notes.map((note) => {
                if(note?.description){
                    description: note?.description
                }
            }) : []

        const updateCropGrowthStage = await client.cropGrowthStage.update({
            where: {
                cropId: crop.id,  
                id: crpgwthId
            }, 
            data: {
                stageName, 
                notes: Notes, 
                crop: {
                    connect: {
                        id: crop.id
                    }
                }
            }
        })

        res.status(200).json({updateCropGrowthStage, message: 'crop growth stage has been successfully updated'})
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

// delete the cropGrowth stage associated to the particular crop which associated to the particular field and which associated to the particular user/farmer
export const deleteGrowthStage = async(req, res) => {
    
    try{

        const userId = req.user.id;
        const fieldId = req.field.id; 
        const cropId = req.crop.id; 

        if(!userId || !fieldId || !cropId){
            res.status(400).json({message: 'userId and fileId and cropId is required'})
        }

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(400).json({message: 'user data not found, invalid userid'})
        }

        const field = await client.field.findFirst({
            where: {
                userId: user.id, 
                id: fieldId
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
            }
        })

        if(!crop){
            res.status(400).json({message: 'crop data not found, invalid cropId'})
        }

        const { crpgwthId } = req.params;
        
        const cropgrowthStage = await client.cropGrowthStage.findFirst({
            where: {
                cropId: crop.id, 
                id: crpgwthId
            }, 
            select: {
                id: true
            }
        })

        if(!cropgrowthStage){
            res.status(400).json({message: 'crop growth stage is not found'})
        }

        const deleteGrowthStage = await client.cropGrowthStage.delete({
            where: {
                cropId: crop.id, 
                id: cropgrowthStage.id
            }
        })

        res.status(200).json({message: 'crop growth stage has been successfully deleted'})

    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}