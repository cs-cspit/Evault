import CryptoJS from 'crypto-js';

// Encryption key
const ENCRYPTION_KEY = 'judiciary';

// Utility functions for encryption/decryption
const encryptData = (data) => {
  if (data === null || data === undefined) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData) => {
  if (!encryptedData) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Secure localStorage wrapper
const secureStorage = {
  setItem: (key, value) => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
      return;
    }
    const encryptedValue = encryptData(value);
    localStorage.setItem(key, encryptedValue);
  },
  getItem: (key) => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;
    return decryptData(encryptedValue);
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};

export default secureStorage;
