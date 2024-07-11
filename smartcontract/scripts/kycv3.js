const { ethers, upgrades } = require('hardhat');

async function main() {
    const deployer = "0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3";
    const Contract = await ethers.getContractFactory('KYCRegistryV32');
    console.log('Upgrading KYCRegistry Version Upgrade Contract...');
    await upgrades.upgradeProxy('0x18F9c1AeCd8B14448c6845deeEA5D9c17b244202', Contract);
    console.log('KYCRegistry Version upgraded');
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run --network custom scripts/kycv3.js
// deployed: 0x18F9c1AeCd8B14448c6845deeEA5D9c17b244202