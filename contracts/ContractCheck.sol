// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ContractCheck {

    struct Certificate {
        string name;
        address contractAddress;
        address owner;
        uint256 chainId;
        address[] validators;
        bool valid;
        uint256 creationTime;
    }

    bytes32[] public certificatesIds;
    mapping(bytes32 => Certificate) public certificateRegistry;
    mapping (address => bytes32[]) public userValidatedCertificateIds;

    // Events
    event NewCertificateCreated(bytes32 indexed certificateId, address indexed contractAddress, address indexed owner, string name);
    event Validated(bytes32 indexed certificateId, address indexed validator, address indexed contractAddress);
    event CertificateModified(bytes32 indexed certificateId, address indexed contractAddress, address indexed owner, string name);

    // Public functions
    function newCertificate(string memory _name, address _contractAddress, uint256 _chainId) public {
        Certificate memory newCertificate = Certificate(_name, _contractAddress, msg.sender, _chainId, new address[](0), true, block.timestamp);
        bytes32 uid = _hash(_name, _contractAddress, msg.sender);
        // check that the certificate does not exist
        require(certificateRegistry[uid].contractAddress == address(0), "Certificate already exists");
        certificateRegistry[uid] = newCertificate;
        certificatesIds.push(uid);
        emit NewCertificateCreated(uid, _contractAddress, msg.sender, _name);
    }

    function batchValidate(bytes32[] memory _certificateIds) public {
        for (uint i = 0; i < _certificateIds.length; i++) {
            _validate(_certificateIds[i]);
        }
    }

    // Internal functions
    function _validate(bytes32 _certificateId) public {
        // TODO : do checks here
        require(certificateRegistry[_certificateId].owner != address(0), "Certificate does not exist");
        certificateRegistry[_certificateId].validators.push(msg.sender);
        userValidatedCertificateIds[msg.sender].push(_certificateId);
        emit Validated(_certificateId, msg.sender, certificateRegistry[_certificateId].contractAddress);
    }


    // Getters
    function getCertificateIds() public view returns(bytes32[] memory) {
        return certificatesIds;
    }

    function getCertificatedIdsOfCertificatesValidatedByUser(address _user) public view returns(bytes32[] memory) {
        return userValidatedCertificateIds[_user];
    }

    // Helpers
    // _hash creates a unique id for each certificate
    function _hash(string memory _name, address _contract, address _owner) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _contract, _owner));
    }

}