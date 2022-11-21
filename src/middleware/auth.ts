import { Request, Response, NextFunction } from "express"
import { environment } from "../configuration"
import Logging from "../library/Logging"

const authentication = (req: Request, res: Response, next: NextFunction) =>{
    const API_KEY=req.header("x-api-key") || undefined

    if(API_KEY && API_KEY===environment.API_KEY){
        next()
    }else{
        Logging.error("[Authentication] - 403 - Unauthorized")
        res.status(403).json({
            status: "false",
            message: "Unauthorized"
        })
    }
}

export {authentication}