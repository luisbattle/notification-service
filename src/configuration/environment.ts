import dotenv from 'dotenv'
dotenv.config()
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_HOST = process.env.MONGO_HOST
const MONGO_URL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/notification-service?authMechanism=DEFAULT&authSource=admin`

const environment ={
    PORT: process.env.PORT || 3000,
    API_KEY: process.env.API_KEY || undefined,
    mongo: {
        url: MONGO_URL
    }
}

export {environment}