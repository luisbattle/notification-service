import { Request, Response } from "express"
import mongoose from "mongoose"
import Logging from "../../library/Logging"
import Event from '../../models/Event'
import { getServiceConfiguration, messageProcessor } from "../../services"

// Send Event
const sendEvent = async (req: Request, res: Response) =>{
    const serviceName = req.body.serviceName
    const notificationTitle = req.body.notificationTitle
    const notificationDescription = req.body.notificationDescription
    const notificationUrl = req.body.notificationUrl || undefined
    const channels = req.body.channels || []

    if(!serviceName){
        res.status(404).send({
            "statusCode": 404,
            "message": `Service ${serviceName} not found`
        })
    }
    
    //getServiceConfiguration
    const serviceConfiguration = await getServiceConfiguration(serviceName)

    // If configuration not exist
    if(!serviceConfiguration){
        res.status(404).send({
            "statusCode": 404,
            "message": `Service ${serviceName} not found`
        })
    }else{
        // Store message into DB to then SEND(async) and return EventID
        const status = {
            provider: [
            ]
        }
        const event = new Event({
            _id: new mongoose.Types.ObjectId(),
            serviceName: serviceName,
            notificationTitle: notificationTitle,
            notificationDescription: notificationDescription,
            channels: channels,
            status: status
        })
        return event.save()
        .then((event)=> {
            res.status(201).json(
            {
            eventId: event._id,
            serviceName: event.serviceName,
            notificationTitle: event.notificationTitle,
            notificationDescription: event.notificationDescription,
            channels: event.channels,
            status: "Processing..."
            })
            Logging.info("Event saved into MongoDB")
            
            //Send Message
            messageProcessor(serviceConfiguration,notificationTitle,notificationDescription,notificationUrl,channels,String(event._id))
        })
        .catch((error)=> res.status(500).json({error}))
    }
}

// get Event Status By ID
const getEvent = (req: Request, res: Response) => {
    const eventId = req.query.eventId || undefined
    if(eventId){
        Event.findById({"_id":eventId})
        .then((event)=>{
            if(event){
                res.status(200).json({event})
            }else{
                res.status(404).json({event:"EventId not found"})
            }
        })
        .catch((error)=> res.status(500).json({error}))
    }else{
        res.status(404).json({message: "eventId not found"})
    }

}

export {sendEvent,getEvent}