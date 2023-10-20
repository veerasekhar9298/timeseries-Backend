require('dotenv').config();
const { Server} = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const CryptoJS = require('crypto-js');
const app = express();
const PORT = 3565;
const data = require('./data.json');

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5443'],
    },
});

function encryptMessage(message) {
    const jsonString = JSON.stringify(message);
    const secret_key = CryptoJS.SHA256(jsonString).toString(CryptoJS.enc.Hex);
    const sumCheckMessage = {
      ...message,
      secret_key,
    };
    return CryptoJS.AES.encrypt(
      JSON.stringify(sumCheckMessage),
      process.env.AES_KEY
    ).toString();
  }





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

        const jsonString = JSON.stringify(originalMessage);

        const secret_key = CryptoJS.SHA256(jsonString).toString(CryptoJS.enc.Hex);

        const sumCheckMessage = {
            ...originalMessage,
            secret_key,
        };
        const encryptedMessage = encryptMessage(originalMessage)
        
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
