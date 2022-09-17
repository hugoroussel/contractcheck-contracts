require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    optimisticEthereum:{
      url: "https://opt-mainnet.g.alchemy.com/v2/"+process.env.ALCHEMY_KEY,
      accounts: [process.env.KEY],
      chainId: 10,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};
