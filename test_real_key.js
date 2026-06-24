const CryptoJS = require('crypto-js');

function decrypt(encryptedString, keyStr) {
  const [ivHex, encryptedHex] = encryptedString.split(':');
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const encryptedCP = CryptoJS.enc.Hex.parse(encryptedHex);
  const key = CryptoJS.enc.Utf8.parse(keyStr);

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedCP },
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}

const encString = 'd1f8025807e8f21a46eb8b0fb2b8140c:5968d2144a740bb2577ed948fa2c935';
const key1 = '12345678901734569890123456789012'; // Real key

try {
  console.log("Decrypted (real):", decrypt(encString, key1));
} catch (e) {
  console.error("Error real:", e.message);
}
