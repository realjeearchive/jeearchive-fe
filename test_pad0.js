const CryptoJS = require('crypto-js');
const encStringBase = 'd1f8025807e8f21a46eb8b0fb2b8140c:5968d2144a740bb2577ed948fa2c9350';
const key1 = '12345678901734569890123456789012'; // Real key

const [ivHex, encryptedHex] = encStringBase.split(':');
const iv = CryptoJS.enc.Hex.parse(ivHex);
const encryptedCP = CryptoJS.enc.Hex.parse(encryptedHex);
const key = CryptoJS.enc.Utf8.parse(key1);
const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedCP }, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
const str = decrypted.toString(CryptoJS.enc.Utf8);
console.log("Decrypted with appended 0:", str);
