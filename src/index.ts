import app from './app'
import {environment} from './configuration'
import Logging from './library/Logging'

const PORT=process.env.PORT || 3000
app.listen(PORT, ()=>{
    Logging.info(`Server is running on PORT ${PORT}`)
})