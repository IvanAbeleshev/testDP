import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { sequelize } from './db'
import { checkCreateFirstAdminUser } from './common/generally'
import mainRouter from './routs/main'
import fileUpload from 'express-fileupload'
import path from 'path'

const portApplication = process.env.PORT || 5000

const server: express.Application = express()
server.use(express.json())
server.use(cors())
server.use(fileUpload())
server.use(express.static(path.resolve(__dirname, 'static')))
server.use(mainRouter)

const startServer = async() =>{
    let countTry = 5;
    for(let i=0; i<=countTry; i++){
        try{       
            await sequelize.authenticate()
            await sequelize.sync()

            server.listen(portApplication , ()=>{console.log(`Server starting on port ${portApplication}`)})
            await checkCreateFirstAdminUser()
            break
        }
        catch(e){
            console.log("web server will bee restarted at 5s")
            await new Promise(res=>setTimeout(res, 5000))
            
        }

    }
}

startServer()
