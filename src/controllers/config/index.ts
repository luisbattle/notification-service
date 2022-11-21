import { NextFunction, Request, Response } from "express"
import mongoose from "mongoose"
import Service from "../../models/Service"
 
const getAllServices = (req: Request, res: Response) =>{
    return Service.find({})
        .then((services: any)=>(res.status(200).json({services})))
        .catch((error)=>(res.status(500).json({error})))

}

const saveConfig = (req: Request, res: Response) =>{
    const serviceName = "payments"
    const description = "service test para mongoose en TS"
    const notification ={
        "providers": [
            {
              "name": "SLACK",
              "webhooks": [
                {
                  "webhook": "https://hooks.slack.com/services/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",
                  "enable": true
                },
                {
                  "webhook": "https://hooks.slack.com/services/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",
                  "enable": false
                }
              ]
            }
          ]
    }

    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        serviceName,
        description,
        notification
    })
    return service.save()
        .then((service)=> res.status(201).json({service}))
        .catch((error)=> res.status(500).json({error}))

}

export {getAllServices, saveConfig}