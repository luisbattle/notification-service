import mongoose, {Document, Schema} from "mongoose";

interface IEvents {
    serviceName: string;
    notificationTitle: string;
    notificationDescription: string;
    channels: object;
    status: {provider: [IStatus]};
}

interface IStatus {
            name: string,
            webhook: [
                {
                    name: string,
                    status: string,
                    statusDescription: string
                }
            ]
}

export interface IEventsModel extends IEvents, Document{}

const EventSchema: Schema = new Schema(
    {
        serviceName: { type: String, required: true},
        notificationTitle: { type: String, required: true},
        notificationDescription: { type: String, required: true},
        channels: { type: Object, required: true},
        status: { type: Object}
    },
    {
        versionKey: false,
        collection: 'events'
    }
)

export default mongoose.model<IEvents>('events',EventSchema)