const { ethers, upgrades } = require('hardhat');

async function main() {
    const deployer = "0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3";
    const Contract = await ethers.getContractFactory('KYCRegistry');
    console.log('Deploying KYCRegistry Contract...');
    const contract = await upgrades.deployProxy(Contract, [], { initializer: 'initialize' });
    await contract.waitForDeployment();
    console.log('KYCRegistry deployed to:', contract);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

// npx hardhat run --network custom scripts/kyc.js
// deployed: 0x18F9c1AeCd8B14448c6845deeEA5D9c17b244202