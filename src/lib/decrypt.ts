import CryptoJS from 'crypto-js';

// Fallback hardcoded key - ensure this matches your backend config exactly
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '12345678901734567890123456789012';

export const decryptData = <T>(encryptedString: string): T | null => {
  // 1. Debug: Check if env var is loaded or falling back
  console.log("[Debug] Key Source:", process.env.NEXT_PUBLIC_ENCRYPTION_KEY ? "Env Var" : "Fallback String");
  console.log("[Debug] Key Used:", ENCRYPTION_KEY); // Verify this matches backend

  if (!encryptedString || typeof encryptedString !== 'string') {
    console.error("[Debug] Invalid input:", encryptedString);
    return null;
  }

  // 2. Debug: Check input format
  if (!encryptedString.includes(':')) {
    console.error("[Debug] Missing IV separator (:). Received:", encryptedString.substring(0, 50));
    return null;
  }

  try {
    const [ivHex, encryptedHex] = encryptedString.split(':');
    
    console.log("[Debug] IV Hex:", ivHex);
    console.log("[Debug] Ciphertext Hex (first 20 chars):", encryptedHex.substring(0, 20));

    // 3. Parse components
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encryptedCP = CryptoJS.enc.Hex.parse(encryptedHex);
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);

    // 4. Decrypt
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedCP } as CryptoJS.lib.CipherParams,
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // 5. Convert to UTF-8
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      console.error("[Debug] Decryption result is empty. Possible causes: Wrong Key, Wrong IV, or Padding Mismatch.");
      return null;
    }

    console.log("[Debug] Decryption Success! Length:", decryptedString.length);
    
    // 6. Parse JSON
    return JSON.parse(decryptedString) as T;

  } catch (error) {
    console.error("[Debug] Decryption Logic Error:", error);
    return null;
  }
};