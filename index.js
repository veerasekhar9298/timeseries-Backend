require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 4242;
const configureDB = require('./config/db');
const CryptoJS = require('crypto-js');
const io = require('socket.io-client');
const TimeSeries = require('./model/series-Modal');
const { Server} = require('socket.io');
const { createServer } = require('http')
const app = express();
app.use(cors());
configureDB();

const key = CryptoJS.enc.Hex.parse(process.env.AES_KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.IV); 

function decryptMessage(encryptedMessage,key,iv) {
    
    const decrypted =  CryptoJS.AES.decrypt(encryptedMessage, key, {
        iv: iv,
        mode: CryptoJS.mode.CTR, // Use CTR mode
      })

      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  }
  







const httpServer = createServer(app);

const io2 = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

io2.on("connection",(socket)=>{
    console.log(`connected to the ${socket.id}`)

    // socket.emit('data',"working socket")
})

const socket = io('http://localhost:3565');



socket.on('data', async (data) => {
    // console.log(data,'encrypted Message Reciving')
    
    try {
        const message = decryptMessage(data,key,iv)
            
        const { secret_key, ...rest } = message;
        
        const validation_key = CryptoJS.SHA256(JSON.stringify(rest)).toString(CryptoJS.enc.Hex);

        if (validation_key === secret_key) {
            const currentTime = Math.floor(new Date() / 60000);
            const FoundDoc = await TimeSeries.findOne({ timestamp: currentTime });


            if (!FoundDoc) {
                const output = new TimeSeries({
                    data: rest,
                    timestamp: currentTime,
                });
                const final = await output.save();
                console.log(final, "new record");
                
                io2.emit('data',final)
            } else {
                const findDoc = await TimeSeries.findOneAndUpdate(
                    { timestamp: currentTime },
                    { $push: { data: rest } },
                    { new: true }
                    );
                    console.log(findDoc, "updated Record");
                    io2.emit('data',findDoc)
                    
                   
                }
        } else {
            console.error('Data integrity compromised. Secret keys do not match.');
        }
    } catch (error) {
        console.error('Error processing data:', error);
    }
});

httpServer.listen(PORT, () => {
    console.log(`Listener server is running on the port ${PORT}`);
});
