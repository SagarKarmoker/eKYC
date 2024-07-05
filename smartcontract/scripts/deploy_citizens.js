const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Ensure you have compiled your contracts with `npx hardhat compile`
  const ContractFactory = await ethers.getContractFactory("Citizens");
  const contract = await ContractFactory.deploy("0xf3ff5d970d508d6ac93c03530574dbb7c60ea479"); // Add constructor arguments if there are any
  console.log("Contract address:", contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 0xf3ff5d970d508d6ac93c03530574dbb7c60ea479 (relayer)
// 0xdb2858e497f1976e956f9f625237ffccb6b57e3e (kyc registry)
// 0x956d2836B50A63D635932E7F388DC79ba5f7dcD9 (factory)
// 0xc9bd96a68995487f4f4a9c90d7e90ae95ce44aa3 (citizens)