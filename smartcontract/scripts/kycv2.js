const { ethers, upgrades } = require('hardhat');

async function main() {
    const deployer = "0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3";
    const Contract = await ethers.getContractFactory('WalletContract');
    console.log('Upgrading KYCRegistryV2 Contract...');
    await upgrades.upgradeProxy('0x507f6ac3C5ECAb82849Bd5786B3219EDeE44bd4c', Contract);
    console.log('KYCRegistryV2 upgraded');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run --network custom scripts/kycv2.js
// deployed: 0x507f6ac3C5ECAb82849Bd5786B3219EDeE44bd4c