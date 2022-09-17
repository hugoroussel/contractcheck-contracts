// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    let CF = await ethers.getContractFactory("ContractCheck")
    cc = await CF.deploy()
    console.log("contract check contract deployed at", cc.address)

    // get signers
    let signers = await ethers.getSigners();
    alice = signers[0];
    bob = signers[1];

    let certificateContractAddress0 = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    let chainId = 1;
    let name0 = "Uniswap V2 Router";
    let tx0 = await cc.newCertificate(name0, certificateContractAddress0, chainId);

    let certificateContractAddress = "0x1111111254fb6c44bAC0beD2854e76F90643097d";
    let name = "1inch AggregationRouterV4";
    let tx = await cc.newCertificate(name, certificateContractAddress, chainId);

    // await cc.connect(bob).newCertificate("Bob's Uniswap V2 Router", certificateContractAddress0, chainId);

    // get all certificates
    let certificates = await cc.getCertificateIds();
    console.log("certificates", certificates);

    await cc.connect(bob).batchValidate(certificates)

    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
