require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "custom",
  networks: {
    hardhat: {
    },
    custom: {
      url: "http://129.154.245.79:8545",
      accounts: ["de80c5713520dfff769b441de6a941107e4f1c05fa98851c7136daea184193b6"],
      gasPrice: 0
    }
  },
  solidity: "0.8.24",
};

/*
https://u0bvcfqp4h:tEssggAgcIZeZkLOGiEI6pOc3JK2THGvou2KSynHZF0@u0gg3fjcal-u0evxjdy82-rpc.us0-aws.kaleido.io/
*/