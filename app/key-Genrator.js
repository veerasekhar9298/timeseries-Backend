const CryptoJS = require('crypto-js')

// Function to generate a random 256-bit key
function generateRandomKey() {
    return CryptoJS.lib.WordArray.random(32);
  }



  function encryptMessageAES256CTR(message, key) {
    // Use a random 16-byte IV for AES-256-CTR
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(message), key, {
      iv: iv,
      mode: CryptoJS.mode.CTR,
    });
  
    // Combine IV and ciphertext for transmission
    const ciphertext = iv.concat(encrypted.ciphertext);
    return ciphertext.toString(CryptoJS.enc.Hex);
  } 

 console.log( generateRandomKey())