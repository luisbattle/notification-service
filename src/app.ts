import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import api from './routes/index'
import { environment } from './configuration';
import Logging from './library/Logging';

const app = express()

// connecto to mongoose
mongoose.connect(environment.mongo.url, {retryWrites: true, w: 'majority'})
.then(() =>{
    Logging.info('connected to MongoDB')
})
.catch((error) =>{
    Logging.error('Unable connect to database')
    Logging.error(error)
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'))

app.use('/api/',api )
app.use((req,res,next)=>{
    const error = new Error('Page not found')
    res.status(404).json({message: error.message}) 
})

export default app;