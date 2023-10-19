require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 4242
const configureDB = require('./config/db') 



const app = express()

configureDB()





app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
})