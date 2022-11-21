import express from 'express';
import {healthcheck, sendEvent,getEvent, getAllServices,saveConfig} from '../controllers/index'
import { authentication } from '../middleware/auth';
const api= express.Router()

api.get('/healthcheck',healthcheck)

api.post('/service',authentication, saveConfig)
api.get('/services',authentication, getAllServices)

api.post('/events',authentication, sendEvent)
api.get('/events',authentication, getEvent)

// api.post('/event/ID',eventStatusId)


export default api