import mongoose, {Document, Schema} from "mongoose";

interface IService {
    serviceName: string;
    description: string;
    notification: object;
}

export interface IServiceModel extends IService, Document{}

const ServiceSchema: Schema = new Schema(
    {
        serviceName: { type: String, required: true},
        description: { type: String, required: true},
        notification: { type: Object, required: true}
    },
    {
        versionKey: false,
        collection: 'services'
    }
)

export default mongoose.model<IService>('services',ServiceSchema)