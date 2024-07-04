require('dotenv').config();
const { ethers } = require('ethers');
const Citizens = require('./abis/Citizens.json');
const CitizenWalletFactory = require('./abis/CitizenWalletFactory.json');
const KYCReg = require('./abis/KYCRegistry.json')
