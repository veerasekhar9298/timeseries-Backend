require('dotenv').config();
const { Server} = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const CryptoJS = require('crypto-js');
const app = express();
const PORT = 3565;
const data = require('./data.json');

// here  key and IV are stored in the hexadecimalWay so parse it 
const key = CryptoJS.enc.Hex.parse(process.env.AES_KEY);
const iv = CryptoJS.enc.Hex.parse(process.env.IV); 

// create the app and assigned server 
const httpServer = createServer(app);

// we destructured Server fron the socket.io to upgrade normal server to a websocket server
// cors origin polices add to socket so the reciver should bre running on this host 5443 
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5443'],
    },
});


// function to make the encryption of the  Message 
function encryptMessage(message,key,iv) {
    const jsonString = JSON.stringify(message);
    const secret_key = CryptoJS.SHA256(jsonString).toString(CryptoJS.enc.Hex);
    const sumCheckMessage = {
        ...message,
        secret_key,
    };
    const jsonString2 = JSON.stringify(sumCheckMessage);
  
  
  const  encrypted = CryptoJS.AES.encrypt(jsonString2, key, {
    iv: iv,
    mode: CryptoJS.mode.CTR, // Use CTR mode
  });
 
  return encrypted.toString()
    
  }




 // socket made anconnection 
io.on('connection', (socket) => {

    console.log(`connected to the ${socket.id}`);


    const getRandomData = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    };



    const sendEncryptedData = setInterval(() => {
        
        const originalMessage = {
            name: getRandomData(data.names),
            origin: getRandomData(data.cities),
            destination: getRandomData(data.cities)
        };

        const encryptedMessage = encryptMessage(originalMessage,key,iv)
        
        socket.emit('data',encryptedMessage)
        

    }, 10000);

    socket.on('disconnect', () => {
        console.log(`Disconnected from socket: ${socket.id}`);
        clearInterval(sendEncryptedData);
      })
      
});

httpServer.listen(PORT, () => {
    console.log(`emitter service running on ${PORT}`);
});
