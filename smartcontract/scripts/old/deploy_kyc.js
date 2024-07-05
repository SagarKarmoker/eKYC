const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Ensure you have compiled your contracts with `npx hardhat compile`
  const ContractFactory = await ethers.getContractFactory("KYCRegistry");
  const contract = await ContractFactory.deploy(); // Add constructor arguments if there are any
  console.log("Contract address:", contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 0x426e7b96f39f503adfa6823cdc0d42d8bea096e8