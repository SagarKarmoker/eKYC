const { ethers, upgrades } = require('hardhat');

async function main() {
    const deployer = "0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3";
    const Contract = await ethers.getContractFactory('WalletContract');
    console.log('Upgrading WalletContractV2 Contract...');
    await upgrades.upgradeProxy('0x956d2836B50A63D635932E7F388DC79ba5f7dcD9', Contract);
    console.log('WalletContractV2 upgraded');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run --network custom scripts/walletcontractv2.js
// deployed: 0x956d2836B50A63D635932E7F388DC79ba5f7dcD9