const crypto = require('crypto');

// Hash the password (same method as used for decryption)
const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

// Generate a random salt
const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Derive a key from the password hash (same method as used for decryption)
const deriveKey = (passwordHash, salt) => {
    return crypto.pbkdf2Sync(passwordHash, salt, 10000, 32, 'sha256');
};

// Encrypt data
const encryptData = (data, passwordHash, salt) => {
    const key = deriveKey(passwordHash, salt);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        salt: salt,
        encryptedData: encrypted
    };
};

// Decrypt data
const decryptData = (encryptedData, passwordHash, salt, iv) => {
    const key = deriveKey(passwordHash, salt);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = {
    hashPassword,
    generateSalt,
    encryptData,
    decryptData
}