const expect = require('chai').expect;
const io = require('socket.io-client');
const server = require('../Emit-service'); // Import your socket server script

describe('Socket Server', () => {
  let socket;

  // Set up a connection before each test
  beforeEach((done) => {
    // Connect to the server
    socket = io.connect('http://localhost:3565');

    socket.on('connect', () => {
      done();
    });
  });

  // Close the connection after each test
  afterEach((done) => {
    if (socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it('should emit data when a client is connected', (done) => {
    // Set up a listener for the 'data' event
    socket.on('data', (data) => {
      // Perform assertions on the received data
      expect(data).to.be.a('string'); // Adjust this based on your actual data structure
      done();
    });
  });

  // Add more test cases to cover different scenarios

});
