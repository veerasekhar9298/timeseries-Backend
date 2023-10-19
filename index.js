require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 4242;
const configureDB = require('./config/db');
const http = require('http');
const CryptoJS = require('crypto-js');
const io = require('socket.io-client');
const TimeSeries = require('./model/series-Modal');
const app = express();
app.use(cors());
configureDB();

const socket = io('http://localhost:3565');

socket.on('data', async (data) => {
    try {
        const decryptedMsg = JSON.parse(CryptoJS.AES.decrypt(data, process.env.AES_KEY).toString(CryptoJS.enc.Utf8));
        const { secret_key, ...rest } = decryptedMsg;
        const validation_key = CryptoJS.SHA256(JSON.stringify(rest)).toString(CryptoJS.enc.Hex);

        if (validation_key === secret_key) {
            // console.log("Valid data", rest);
            const currentTime = Math.floor(new Date() / 60000);
            const FoundDoc = await TimeSeries.findOne({ timestamp: currentTime });

            // console.log(FoundDoc, "foundDoc");

            if (!FoundDoc) {
                const output = new TimeSeries({
                    data: rest,
                    timestamp: currentTime,
                });
                const final = await output.save();
                console.log(final, "new record");
            } else {
                const findDoc = await TimeSeries.findOneAndUpdate(
                    { timestamp: currentTime },
                    { $push: { data: rest } },
                    { new: true }
                );
                console.log(findDoc, "updated Record");
            }
        } else {
            console.error('Data integrity compromised. Secret keys do not match.');
        }
    } catch (error) {
        console.error('Error processing data:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Listener server is running on the port ${PORT}`);
});
