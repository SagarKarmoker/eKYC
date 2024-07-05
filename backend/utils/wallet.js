require('dotenv').config();
const { ethers } = require('ethers');
const sss = require('shamirs-secret-sharing');
const { Buffer } = require('buffer');
const CryptoJS = require('crypto-js');
const ShardKey = require("../models/shardKeyModel");
const WalletContract = require('../abis/WalletContract.json')

// user->shard1 (browser)
// nid->shard2 (kms)
// passwordHash->shard3 (blockchain)

// Smart contract ABI and address
const WalletContractAddress = "0x956d2836B50A63D635932E7F388DC79ba5f7dcD9"

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// A pop-up to confirm the password written from user 
const createWallet = async (nid, password) => {
    // Return to the user shard1, the wallet address

    try {
        const wallet = ethers.Wallet.createRandom();
        const walletAddress = wallet.address;
        const privateKey = wallet.privateKey;

        // SSS
        const secret = Buffer.from(privateKey.slice(2), 'hex'); // Remove '0x' from private key
        const shards = sss.split(secret, { shares: 3, threshold: 2 });

        // Store shard2 in KMS or DB using our key
        const shard2 = new ShardKey({
            nidNumber: nid,
            address: walletAddress,
            shardA: shards[0].toString('hex'),
            shardB: CryptoJS.AES.encrypt(shards[1].toString('hex'), "ekycdev").toString()
        });
        await shard2.save();

        // Store shard3 in blockchain
        const encryptedShard3 = CryptoJS.AES.encrypt(shards[2].toString('hex'), password).toString();

        // Interact with the deployed contract
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(WalletContractAddress, WalletContract.abi, signer);

        // Send the transaction to store shard3 on the blockchain
        const tx = await contract.setWallet(nid, encryptedShard3, {
            gasPrice: 0
        });
        await tx.wait();

        console.log(tx);

        if (tx !== null) {
            // Return the wallet address to the user and shard1
            return {
                walletAddress,
                shard: shards[0].toString('hex')
            };
        }
    } catch (error) {
        console.log(error);
    }
}


const getWalletAddress = (nid) => {
    // Return the wallet address to the user
    return ShardKey.findOne({ nidNumber: nid }).select('address').exec();
}

//TODO: cooking... 🧑‍🍳
// Kyc data submit
const submitKYC = async (ipfsHash, nid) => {
    try {
        // Retrieve shards from the database
        const shardKey = await ShardKey.findOne({ nidNumber: nid }).exec();
        
        if (!shardKey) {
            throw new Error('ShardKey not found for the given NID');
        }

        // Retrieve encryptedShard3 from the blockchain
        const contract = new ethers.Contract(WalletContractAddress, WalletContract.abi, provider);
        const encryptedShard3 = await contract.getWallet(nid);

        if (!encryptedShard3) {
            throw new Error('Shard3 not found on the blockchain for the given NID');
        }

        // Decrypt shardB and shard3
        const shardBDecrypted = CryptoJS.AES.decrypt(shardKey.shardB, "ekycdev").toString(CryptoJS.enc.Utf8);
        const shard3Decrypted = CryptoJS.AES.decrypt(encryptedShard3, "1234").toString(CryptoJS.enc.Utf8);

        // Convert decrypted shards to buffers
        const shard1 = Buffer.from(shardKey.shardA, 'hex');
        const shard2 = Buffer.from(shardBDecrypted, 'hex');
        const shard3 = Buffer.from(shard3Decrypted, 'hex');

        // Combine shards to retrieve the original secret (private key)
        const secret = sss.combine([shard1, shard2, shard3]);

        // Validate the combined secret
        if (!secret || secret.length !== 32) {
            throw new Error('Invalid combined secret length');
        }

        // Create a wallet instance using the recovered private key
        const wallet = new ethers.Wallet(secret, provider);
        const walletAddress = wallet.address;

        console.log(walletAddress);
        return walletAddress;

    } catch (error) {
        console.log(error);
    }
}



// export the function
module.exports = { createWallet, getWalletAddress, submitKYC }