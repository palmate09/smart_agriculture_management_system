import jwt from 'jsonwebtoken'

export const authField = async(req, res, next) => {

    try{

        const fieldToken = req.headers['field-token']?.split(' ')[1]; 

        if(fieldToken === null){
            return res.status(401).json({message: 'fieldToken is not autherized'})
        }


        const decoded = jwt.verify(fieldToken, process.env.JWT_SECRECT); 

        if(!decoded){
            return res.status(404).json({message: 'Invalid token'})
        }

        req.field = decoded
        next(); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}