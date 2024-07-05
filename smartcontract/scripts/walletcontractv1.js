const { ethers, upgrades } = require('hardhat');

async function main() {
    const deployer = "0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3";
    const Contract = await ethers.getContractFactory('WalletContract');
    console.log('Deploying WalletContractV1 Contract...');
    const contract = await upgrades.deployProxy(Contract, [deployer], { initializer: 'initialize' });
    await contract.waitForDeployment();
    console.log('WalletContractV1 deployed to:', contract);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run --network custom scripts/walletcontractv1.js
// deployed: 0xD2D031Df2eDFd36E58D890F7FE602C27263954b1