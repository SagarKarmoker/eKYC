require('dotenv').config();
const { ethers } = require('ethers');
const WalletContract = require('../abis/WalletContract.json')
const KYCRegistryContract = require('../abis/KYCRegistryV31.json')
const {saveTxDataForWallet} = require("./wallet");


const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
// Smart contract ABI and address
const WalletContractAddress = "0xd2d031df2edfd36e58d890f7fe602c27263954b1"
const KYCRegistryContractAddress = "0x18F9c1AeCd8B14448c6845deeEA5D9c17b244202"

const addVerifier = async (verifierAddress) => {
    try {
        // intercat with the deployed contract
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, signer);

        console.log(verifierAddress)

        // Send the transaction to store shard3 on the blockchain
        const tx = await contract.addVerifier(verifierAddress, {
            gasPrice: 0
        });
        await tx.wait();

        if(tx !== null){
            await saveTxDataForWallet(tx, 0, `Verifier added ${verifierAddress}`);
            return {
                status: true,
                message: "Verifier added successfully"
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const removeVerifier = async (verifierAddress) => {
    try {
        // intercat with the deployed contract
        const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        const contract = new ethers.Contract(KYCRegistryContractAddress, KYCRegistryContract.abi, signer);

        // Send the transaction to store shard3 on the blockchain
        const tx = await contract.disableVerifier(verifierAddress, {
            gasPrice: 0
        });
        await tx.wait();

        if(tx !== null){
            await saveTxDataForWallet(tx, 0, `Verifier removed ${verifierAddress}`);
            return {
                status: true,
                message: "Verifier added successfully"
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addVerifier, removeVerifier
}