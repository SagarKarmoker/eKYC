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
        const secret = Buffer.from(privateKey);
        const shards = sss.split(secret, { shares: 3, threshold: 2 });

        // Store shard2 in KMS or DB using our key
        const shard2 = new ShardKey({
            nidNumber: nid,
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

        console.log(tx)

        if (tx !== null) {
            // Return the wallet address to the user and shard1
            return {
                walletAddress,
                shard: shards[0].toString('hex')
            };
        }
    } catch (error) {
        console.log(error)
    }
}

// export the function
module.exports = { createWallet }