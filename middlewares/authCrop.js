import jwt from 'jsonwebtoken'

export const authCrop = async(req, res, next) => {

    try{

        const cropToken = req.headers['crop-token']?.split(' ')[1]; 


        if(cropToken === null){
            return res.status(401).json({message: 'Token is not autherized'})
        }

        const decoded = jwt.verify(cropToken, process.env.JWT_SECRECT); 

        if(!decoded){
            return res.status(404).json({message: 'Invalid token'})
        }

        req.crop = decoded
        next(); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}