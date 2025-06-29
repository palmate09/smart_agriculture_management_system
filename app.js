import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
import fieldRouter from './routes/fieldRoute.js'
import cropRouter from './routes/cropRoute.js'
import activityRouter from './routes/activityRoute.js'
import taskRouter from './routes/taskRoute.js'
import expenseRouter from './routes/ExpenseRoute.js'
import revenueRouter from './routes/RevenueRoute.js'
dotenv.config(); 

const app = express(); 

app.use(express.json()); 


app.use('/api', userRouter);
app.use('/api', fieldRouter);  
app.use('/api', cropRouter); 
app.use('/api', activityRouter); 
app.use('/api', taskRouter);
app.use('/api', expenseRouter); 
app.use('/api', revenueRouter)

app.listen(process.env.PORT || 8080)

// export default app; 