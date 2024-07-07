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

// TODO: Cooking ⚠️
const getKYCUsingAddr = async (address) => {
    try {
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, provider);
        const kyc = await contract.getKYCData(address);
        console.log(kyc)
        if (kyc.reason == 'Verifier not found in list'){
            return {status: false, message: 'Verifier not found in list'}
        }
        else{
            return kyc
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
    orgGrantAccessAddresses, orgGrantAccess, getKYCUsingAddr, getKYCUsingNID
}