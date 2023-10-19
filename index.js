require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 4242
const configureDB = require('./config/db') 
const http = require('http')
const CryptoJS = require('crypto-js')
// const Emitter = require('./app/emitter-Service/Emit-service')
const io = require('socket.io-client')

const app = express()
app.use(cors())
configureDB()

const socket = io('http://localhost:3565')

socket.on('data',(data)=>{
    

    const decryptedMsg = JSON.parse(CryptoJS.AES.decrypt(data, process.env.AES_KEY).toString(CryptoJS.enc.Utf8))

    const { secret_key, ...rest } = decryptedMsg

    const validation_key =  CryptoJS.SHA256(JSON.stringify(rest)).toString(CryptoJS.enc.Hex)

    if (validation_key === secret_key) {
        console.log("valid data",rest)
    
    } else {
      console.error('Data integrity compromised. Secret keys do not match.');
    }

})


app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
})