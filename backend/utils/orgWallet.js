require('dotenv').config();
const { ethers } = require('ethers');
const sss = require('shamirs-secret-sharing');
const { Buffer } = require('buffer');
const CryptoJS = require('crypto-js');
const ShardKey = require("../models/shardKeyModel");
const WalletContract = require('../abis/WalletContract.json')
const KYCRegistryContract = require('../abis/KYCRegistryV31.json')
const axios = require('axios');

// Smart contract ABI and address
const WalletContractAddress = "0xd2d031df2edfd36e58d890f7fe602c27263954b1"
const KYCRegistryContractAddress = "0x18F9c1AeCd8B14448c6845deeEA5D9c17b244202"

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const orgGrantAccessAddresses = async (orgAddress) => {
    try {
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, provider);
        const citizens = await contract.getOrgAccessKYC(orgAddress);
        return citizens;
    } catch (error) {
        return error;
    }
}

module.exports = {
    orgGrantAccessAddresses
}