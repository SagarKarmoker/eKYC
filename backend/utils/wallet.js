require('dotenv').config();
const { ethers } = require('ethers');
import sss from 'shamirs-secret-sharing'
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-js';
import ShardKey from '../models/shardKeyModel';

// user->shard1 (browser)
// nid->shard2 (kms)
// passwordHash->shard3 (blockchain)

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const signer = provider.getSigner();

// a pop up to confirm the password written from user 
const createWallet = async (nid, password) => { 
    // return to the user shard1, the wallet address

    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // SSS
    const secret = Buffer.from(privateKey)
    const shards = sss.split(secret, { shares: 3, threshold: 2 })

    // store shard2 in KMS or DB using our key
    const shard2 = new ShardKey({
        nidNumber: nid,
        shardB: CryptoJS.AES.encrypt(shards[1], "ekycdev").toString()
    });
    await shard2.save();

    // store shard3 in blockchain
    shards[2] = CryptoJS.AES.encrypt(shards[2], password).toString();
    
    
    // return of the wallet address to the user and shard1
    return {
        walletAddress,
        shard: shards[0]
    };
}