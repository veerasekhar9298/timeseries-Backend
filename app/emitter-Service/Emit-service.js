require('dotenv').config()
const { Server, Socket } = require('socket.io');
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

io.on('connection', (socket) => {
    // This will only run when a client connects
    console.log(`connected to the ${socket.id}`);

    const sendEncryptedData = setInterval(() => {
        const getRandomData = (array) => {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        };

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
        // console.log(sumCheckMessage);
        const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify(sumCheckMessage),"00eba3b45736de0f4963ef3018322923514bd8b1112883424fb14bd926369ad8").toString()
        socket.emit('data',encryptedMessage)

    }, 10000);
});

httpServer.listen(PORT, () => {
    console.log(`emitter service running on ${PORT}`);
});
