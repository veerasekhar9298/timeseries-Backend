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
   cd node-application 
   npm install 


2. start the Emitter Service following Command 
        node Emit-service.js 
        this will make the emitter server running 

3. start the Listener Service following Command 
        node index.js 
        this  will make the conection with the emitter 

4. if the connection is established data from emitter will send recived by the Listener 

5. For Tracking the data run the frontend application data will be shown real time with success Rate  

        


