import {Request,Response} from 'express'

const healthcheck= (req: Request, res: Response)=>{
    res.send({
        uptime: process.uptime(),
        status: "OK :)"
    })
}

export {healthcheck}