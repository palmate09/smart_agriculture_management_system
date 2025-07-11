import jwt from 'jsonwebtoken'

export const authActivity = async(req, res, next) => {

    try{

        const token = req.headers['activity-token']?.split(' ')[1]; 


        if(token === null){
            return res.status(401).json({message: 'Token is not autherized'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRECT); 

        if(!decoded){
            return res.status(404).json({message: 'Invalid token'})
        }

        req.activity = decoded
        next(); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}