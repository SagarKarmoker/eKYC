require('dotenv').config();
const { ethers } = require('ethers');
const sss = require('shamirs-secret-sharing');
const { Buffer } = require('buffer');
const CryptoJS = require('crypto-js');
const ShardKey = require("../models/shardKeyModel");
const WalletContract = require('../abis/WalletContract.json')
const KYCRegistryContract = require('../abis/KYCRegistryV31.json')
const axios = require('axios');
const Approved = require('../models/approvedModel');
const KYC = require('../models/kycModel');
const {decryptShard} = require('./wallet')

// Smart contract ABI and address
const WalletContractAddress = "0xd2d031df2edfd36e58d890f7fe602c27263954b1"
const KYCRegistryContractAddress = "0x18F9c1AeCd8B14448c6845deeEA5D9c17b244202"

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const orgGrantAccessAddresses = async (orgAddress) => {
    try {
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, provider);
        const citizens = await contract.getOrgAccessKYC(orgAddress);

        // get name, nid
        const citizensData = [];
        const citizenData = {
            name: '',
            nid: '',
            address: ''
        }
        
        for (let i = 0; i < citizens.length; i++) {
            console.log(citizens[i] )
            const nid = await Approved.findOne({ walletAddress: citizens[i] }, 'nid');
            const name = await KYC.findOne({ nidNumber: nid.nid}, 'fullNameEnglish');
            citizenData.name = name.fullNameEnglish;
            citizenData.nid = nid.nid;
            citizenData.address = citizens[i];
            citizensData.push(citizenData);
        }

        return citizensData;
    } catch (error) {
        return error;
    }
}

const orgCreateWallet = async (password) => {
    try {
        const wallet = ethers.Wallet.createRandom();
        const walletAddress = wallet.address;
        const privateKey = wallet.privateKey;

        // org ID for the organization 
        // generate random org ID but must start with 123
        const orgId = '123' + Math.floor(100000 + Math.random() * 900000);

        // SSS
        const secret = Buffer.from(privateKey.slice(2), 'hex'); // Remove '0x' from private key
        const shards = sss.split(secret, { shares: 3, threshold: 2 });

        // Store shard3 in blockchain
        const encryptedShard3 = CryptoJS.AES.encrypt(shards[2].toString('hex'), password).toString();

        // Interact with the deployed contract
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(WalletContractAddress, WalletContract.abi, signer);

        // Send the transaction to store shard3 on the blockchain
        const tx = await contract.setWallet(parseInt(orgId), encryptedShard3, walletAddress, {
            gasPrice: 0
        });
        await tx.wait();

        console.log(tx);

        if (tx !== null) {
            // Store shard2 in KMS or DB using our key
            const shard2 = new ShardKey({
                nidNumber: orgId,
                address: walletAddress,
                shardA: shards[0].toString('hex'),
                shardB: CryptoJS.AES.encrypt(shards[1].toString('hex'), "ekycdev").toString()
            });
            await shard2.save();

            return {
                walletAddress,
                shard: shards[0].toString('hex'), 
                orgId: orgId
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// TODO: Cooking ⚠️
const getKYCUsingAddr = async (orgId, address) => {
    try {
        const secret = await decryptShard(orgId, "1234");
        const signer = new ethers.Wallet(secret, provider);
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, signer);
        const kyc = await contract.getKYCData(address);
        console.log(kyc)

        const nid = await Approved.findOne({ walletAddress: address }, 'nid');

        if (kyc.reason == 'Verifier not found in list'){
            return {status: false, message: 'Verifier not found in list'}
        }
        else{
            return {
                ipfsHash: kyc[0],
                verified: kyc[1],
                time: kyc[2],
                nid 
            };
        }
    } catch (error) {
        return error;
    }
}

// TODO: Cooking ⚠️
const getKYCUsingNID = async (nid) => {
    try {
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, provider);
        const kyc = await contract.getKYCByNID(nid);
        return kyc;
    } catch (error) {
        return error;
    }
}

// TODO: Cooking ⚠️
const orgGrantAccess = async (orgAddress, citizenAddress) => {
    try {
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, provider);
        const citizens = await contract.grantAccessKYC(orgAddress, citizenAddress);
        return citizens;
    } catch (error) {
        return error;
    }
}


module.exports = {
    orgCreateWallet, orgGrantAccessAddresses, orgGrantAccess, getKYCUsingAddr, getKYCUsingNID
}