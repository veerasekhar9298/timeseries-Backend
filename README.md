# Node.js Application README

## Description
This is a Node.js application that serves as a listener service for processing encrypted messages and a frontend for real-time data display. The application's primary functionalities include:

- Receiving encrypted messages via sockets.
- Decrypting the messages and validating data integrity.
- Storing validated data in a MongoDB database with a time-series model.
- Displaying valid data in real-time on a frontend application.
- Calculating and displaying the success rate for data transmission and decoding.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)

## Installation

To run this application, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/veerasekhar9298/timeseries-Backend.git
   cd timeseries-Backend 
   npm install 
   node Emit-service.js
   //open another terminal of timeseries-Backend
   node index.js

2. Paste the .env file to get the AES Key and the required environment variables

3. if the connection is established data from emitter will send recived by the Listener 

4. For Tracking the data run the frontend application data will be shown real time with success Rate  

        


