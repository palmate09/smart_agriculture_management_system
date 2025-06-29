import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
import fieldRouter from './routes/fieldRoute.js'
import cropRouter from './routes/cropRoute.js'
import activityRouter from './routes/activityRoute.js'
dotenv.config(); 

const app = express(); 

app.use(express.json()); 


app.use('/api', userRouter);
app.use('/api', fieldRouter);  
app.use('/api', cropRouter); 
app.use('/api', activityRouter); 

app.listen(process.env.PORT || 8080)

// export default app; 