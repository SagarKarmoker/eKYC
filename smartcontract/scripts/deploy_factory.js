const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Ensure you have compiled your contracts with `npx hardhat compile`
  const ContractFactory = await ethers.getContractFactory("CitizenWalletFactory");
  const contract = await ContractFactory.deploy("0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3" ,"0x5fd189a5692271dc460568892a71b5180ea0c0a2"); // Add constructor arguments if there are any
  console.log("Contract address:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// 0xf3ff5d970d508d6ac93c03530574dbb7c60ea479 (relayer) ->0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3
// 0x426e7b96f39f503adfa6823cdc0d42d8bea096e8 (kyc registry) -> 0x5fd189a5692271dc460568892a71b5180ea0c0a2
// 0xb81334e5E2E845ab9E8cc78E515FCc30151b9c18 (factory) -> 0xdb2858E497F1976e956F9f625237FFcCb6B57E3E