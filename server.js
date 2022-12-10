const app = require("./app")


const dotenv = require("dotenv")
const connectDatabase = require("./config/db")

//Handling UnCaught Error
process.on("uncaughtException",(err)=>{
    console.log(`Error ${err.message}`)
    console.log("Shutting down due to Uncaught error")
    process.exit(1)
})

//Configuration

dotenv.config({path:"backend/config/config.env"})

// Connecting database

connectDatabase()

const server = app.listen(process.env.PORT,()=> {
    console.log(`Server is working on https://localhost:${process.env.PORT}`)
})

// Unhandled Promise Rejection

process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutting down due to unhandled Promise Rejection")
    server.close(()=>{
        process.exit(1)
    })
})
