import client from '../config/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import transporter from '../config/nodemailer.js'
import { randomBytes } from 'node:crypto'

export const signup = async(req, res) => {
    
    try{

        const { username, email, name, password} = req.body;
        
        if(!username || !email || !name || !password){
            res.status(404).json({message: 'fill the given data first'})
            return; 
        }

        const EmailRgx = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
        if(!validator.isEmail(email) && !EmailRgx.test(email)){
            res.status(404).json({message: 'fill the email with correct format'})
            return 
        }

        const usernameRgx = /^[a-zA-Z0-9_]{3,20}$/
        if(!usernameRgx.test(username)){
            res.status(404).json({message: 'fill the username correctly'})
            return 
        }

        const passwordRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
        if(!validator.isLength(password, {min: 6}) && !passwordRgx.test(password)){
            res.status(404).json({message: 'fill the password with 1letter upercase and lowercase and one digit required'})
            return
        }

        const HashedPassword = await bcrypt.hash(password, 10);  

        const userData = await client.user.create({
            data: {
                username,
                email, 
                password: HashedPassword,  
                name
            }
        })


        return res.status(201).json({userId: userData.id, message: 'Signed up successfully'}); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
        return 
    }
}

export const login = async(req, res) => {

    try{

        const { identifier,  password } = req.body;
        
        if (!password || !identifier) {
            return res.status(400).json({ message: 'Email or username and password are required' });
        }
        
        const user = await client.user.findFirst({
            where:{
                OR: [
                    {email: identifier}, 
                    {username: identifier}
                ]
            },
            select: {
                id: true, 
                email: true, 
                password: true, 
                username: true
            }
        })

        if (!user) {
            return res.status(400).json({ message: 'User not found and authentication failed' });
        }

        const Password = bcrypt.compare(password, user.password)

        if(!Password){
            res.status(400).json({message: 'User not found and authentication failed'})
            return 
        }

        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRECT);
        return res.status(200).json({token, message: 'user successfully logged in'});
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
        return 
    }
}

export const getprofile = async(req, res) => {

    try{

        const userId = req.user.id;  

        const user = await client.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!user){
            res.status(401).json({message: 'User not found'})
        }

        res.status(200).json({user, message: 'user found'}); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const updateProfile = async(req, res) => {
    
    try{

        const { email, username, name } = req.body; 
        
        if(!email){
            res.status(404).json({message: 'please fill the required data first'})
        }

        const user = await client.user.findFirst({
            where: {
                email
            }
        })


        if(!user){
            res.status(404).json({message: 'user not found '})
        }

        const usernameRgx = /^[a-zA-Z0-9_]{3,20}$/
        if(!usernameRgx.test(username)){
            res.status(404).json({message: 'fill the username correctly'})
            return 
        }
 
        const updatedUser = await client.user.update({
            where: {
                email
            }, 
            data: { 
                username, 
                name
            }
        })
        res.status(200).json({response: updatedUser, message: 'user updated successfully'}); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const forgotpassrequest = async(req, res) => {

    try{

        const { email } = req.body;
        
        if(!email){
            res.status(404).json({message: 'fill the email first'})
        }

        const user = await client.user.findFirst({
            where: {
                email
            }
        })

        if(!user){
            res.status(404).json({message: 'User not found'})
        }
        
        const token = randomBytes(32).toString('hex');

        await client.passwordResetToken.deleteMany({
            where: {
                userId: user.id,
                expireAt: {
                    gt: new Date()
                }
            }
        })

        const expiry = new Date(Date.now() + 3600000) // expires the token after one hour

        const tokenCreate = await client.passwordResetToken.create({
            data: {
                token: token, 
                userId: user.id,
                expireAt: expiry
            }
        })

        // const resetUrl = `http://localhost:${process.env.PORT}/api/users/forgot-password?token=${token}`

        const info = await transporter.sendMail({
            from: process.env.USER_EMAIL, 
            to: user.email, 
            subject: 'Password Reset Request',
            text: `this is the token for the reset password :- ${tokenCreate.token}` 
        })

        if(!info){
            res.status(404).json({message: 'information Error'})
        }

        res.json(tokenCreate.token)
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}

export const forgotpassword = async(req, res) => {
    try{
        
        const {token} = req.params; 
        const { password } = req.body; 

        const passwordRgx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        if(!validator.isLength(password, {min: 6}) && !passwordRgx.test(password)){
            res.status(404).json({message: 'fill the password with 1letter upercase and lowercase and one digit required'})
            return
        }

        const resetToken = await client.passwordResetToken.findUnique({
            where: {
                token: token
            }, 
            include: {
                user: true
            }
        })

        if(!resetToken || !resetToken.user){
            res.status(404).json({message: 'invalid token or user not found'})
        }

        if(new Date() > resetToken.expireAt){

            await client.passwordResetToken.delete({
                where: {
                    id: resetToken.id
                }
            })

            return res.status(400).json({message:  'Password reset token has expired. Please request a new one.'})
        }

        const HashedPassword = await bcrypt.hash(password, 10); 

        const updatePassword = await client.user.update({
            where: {
                id: resetToken.userId
            },
            data: {
                password: HashedPassword
            }
        })


        await client.passwordResetToken.delete({
            where: {
                id: resetToken.id
            }
        })

        res.json(updatePassword, {message: 'your password has been successfully reset!'}); 
    }
    catch(e){
        res.status(500).json({error: e.message, message: 'Internal server Error'})
    }
}