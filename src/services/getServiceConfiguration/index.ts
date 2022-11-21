// import serviceConfiguration from '../../data/services.json'
import Logging from '../../library/Logging'
import Service, { IServiceModel } from '../../models/Service'

const getServiceConfiguration = async (serviceName: string): Promise<Object> =>{
    const data = await Service.findOne({serviceName:serviceName})
        .catch((error)=>{
            Logging.error(error)
            throw error
        })
    Logging.info(`Service Configuration: ${data}`)

    return JSON.parse(JSON.stringify(data));

}

export {getServiceConfiguration}