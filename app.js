import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
dotenv.config(); 

const app = express(); 

app.use(express.json()); 


app.use('/api', userRouter); 


app.listen(process.env.PORT || 8080)