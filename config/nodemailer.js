import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, 
    secure: process.env.EMAIL_SECURE, 
    auth: {
        user: process.env.USER_EMAIL, 
        pass: process.env.USER_PASSWORD
    }
})

export default transporter; 