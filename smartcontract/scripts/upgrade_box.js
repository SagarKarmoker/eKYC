// scripts/upgrade_box.js
const { ethers, upgrades } = require('hardhat');

async function main () {
  const BoxV2 = await ethers.getContractFactory('BoxV2');
  console.log('Upgrading Box...');
  await upgrades.upgradeProxy('0x0165878a594ca255338adfa4d48449f69242eb8f', BoxV2);
  console.log('Box upgraded');
}

main();
