import express, {json} from "express"
import "express-async-errors"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routers/router.js"
import errorHandler from "./middlewares/errorHandler.js"

dotenv.config()

const server = express()

server.use(cors())
server.use(json())
server.use(router)
server.use(errorHandler)


server.listen(process.env.PORT || 4001 , ()=>{
    console.log(`server on air on: ${ process.env.PORT}`)
})


