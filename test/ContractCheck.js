const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("Contract Check", function () {

    let cc; // contract check contract
    let certificateIds;

    let alice;
    let bob;


    it("Should set up the signer", async function(){
        let signers = await ethers.getSigners(); 
        alice = signers[0];
        bob = signers[1];
        console.log("Alice: " + alice.address);
        console.log("Bob: " + bob.address);
    })

    it("Should deploy the contract", async function () {
        let CF = await ethers.getContractFactory("ContractCheck")
        cc = await CF.deploy()
        console.log("contract check contract deployed at", cc.address)
    });

    it("Should be able to add a first new certificate", async function () {
        let certificateContractAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
        let chainId = 1;
        let name = "Uniswap V2 Router";
        let tx = await cc.newCertificate(name, certificateContractAddress, chainId);
        expect(tx).to.emit(cc.address, "CertificateAdded").withArgs(certificateContractAddress, chainId, name);
    });

    it("Should be able to add a second new certificate", async function () {
        let certificateContractAddress = "0x1111111254fb6c44bAC0beD2854e76F90643097d";
        let chainId = 1;
        let name = "1inch AggregationRouterV4";
        let tx = await cc.newCertificate(name, certificateContractAddress, chainId);
        expect(tx).to.emit(cc.address, "CertificateAdded").withArgs(certificateContractAddress, chainId, name);
    });


    it("There should be two certificate ids", async function () {
        // read public variable certificateIds
        let certificateIds = await cc.getCertificateIds();
        expect(certificateIds.length).to.equal(2);
    });

    it("Should be able to read certificate data information", async function(){
        certificateIds = await cc.getCertificateIds();
        let certificateInfo = await cc.certificateRegistry(certificateIds[0]);
        expect(certificateInfo.name).to.equal("Uniswap V2 Router");
    })

    it("Should be able to validate both certificates", async function(){
        let tx = await cc.connect(ethers.provider.getSigner(1)).batchValidate(certificateIds);
        expect(tx).to.emit(cc.address, "CertificateValidated")        
    })

    it("Should be able to validate both certificates", async function(){
        let userValidatedCertificates = await cc.getCertificatedIdsOfCertificatesValidatedByUser(bob.address)
        expect(userValidatedCertificates.length).to.equal(certificateIds.length);
    });


  });
  