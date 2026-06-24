const CryptoJS = require('crypto-js');
const encString = 'd1f8025807e8f21a46eb8b0fb2b8140c:5968d2144a740bb2577ed948fa2c9357';
const keyFallback = '12345678901734567890123456789012'; // The fallback key (with 7890)
const [ivHex, encryptedHex] = encString.split(':');
const iv = CryptoJS.enc.Hex.parse(ivHex);
const encryptedCP = CryptoJS.enc.Hex.parse(encryptedHex);
const key = CryptoJS.enc.Utf8.parse(keyFallback);
const decrypted = CryptoJS.AES.decrypt({ ciphertext: encryptedCP }, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
const str = decrypted.toString(CryptoJS.enc.Utf8);
console.log("Decrypted with fallback:", str);
