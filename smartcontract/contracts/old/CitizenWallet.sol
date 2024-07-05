// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "./KYCRegisterV2.sol";

interface IKYCRegister {
    function submitKYC(
        string memory _ipfsHash,
        uint256 _nid,
        address factoryAdd
    ) external;

    function grantAccess(address _verifier) external;

    function revokeAccess(address _verifier) external;
}

contract CitizenWallet {
    uint256 NID;
    address public authroity;
    address public relayer;
    address verifierContract;
    Transaction[] previousTransactions;
    Payment[] paymentTransctions;
    bytes32 private merkleRoot;

    struct Transaction {
        address destination;
        bytes data;
    }

    struct Payment {
        address destination;
        bytes data;
    }

    // NID must checked with digit length
    constructor(
        uint256 _NID,
        address _relayer,
        bytes32 _merkleRoot,
        address _verifierContract
    ) {
        NID = _NID;
        authroity = msg.sender;
        relayer = _relayer;
        merkleRoot = _merkleRoot;
        verifierContract = _verifierContract;
    }

    event TransactionExecuted(address indexed destinationAddress, bytes data);

    modifier onlyWithValidProof(bytes32[] calldata proof) {
        require(
            verifyRecoveryContact(proof, msg.sender),
            "Invalid proof or not authorized."
        );
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "You are not the Relayer");
        _;
    }

    modifier onlyAuthority() {
        require(msg.sender == authroity, "You are not the authority");
        _;
    }

    function updateRelayer(address _relayer) external onlyAuthority {
        relayer = _relayer;
    }

    function updateMerkleRoot(bytes32 _merkleRoot) external onlyAuthority returns(bool) {
        merkleRoot = _merkleRoot;
        return true;
    }

    function verifyRecoveryContact(
        bytes32[] memory proof,
        address recoveryContact
    ) public view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(recoveryContact));
        return verify(proof, merkleRoot, leaf);
    }

    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash < proofElement) {
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }
        return computedHash == root;
    }

    /* 
        change proof type
        data will be tx data but not sure
        destinationAddress -> the smartcontract address we want to call
    */
    function executeTransction(
        address destinationAddress,
        string memory data,
        bytes32[] calldata proof
    ) external onlyRelayer onlyWithValidProof(proof) returns (bytes memory) {
        bytes memory encodedData = abi.encodePacked(data);
        (bool success, bytes memory result) = destinationAddress.call(
            encodedData
        );
        require(success, "Only Relayer can execute the transction");
        previousTransactions.push(Transaction(destinationAddress, encodedData));
        emit TransactionExecuted(destinationAddress, encodedData);
        return result;
    }

    function transferFund(address _to, uint256 amount)
        external
        returns (bytes memory)
    {
        (bool success, bytes memory result) = _to.call{value: amount}("");
        require(success, "Transfer failed.");
        return result;
    }

    function getTransctions() public view returns (Transaction[] memory) {
        return previousTransactions;
    }

    function getNID() public view returns (uint256) {
        return NID;
    }

    function getTxDetails() public view returns (string[] memory) {
        string[] memory data = new string[](previousTransactions.length);
        for (uint256 i = 0; i < previousTransactions.length; i++) {
            data[i] = bytesToString(previousTransactions[i].data);
        }
        return data;
    }

    function bytesToString(bytes memory byteData)
        private
        pure
        returns (string memory)
    {
        return string(abi.encode(byteData));
    }

    function submitKYC(string memory _ipfsHash, uint256 _nid)
        public
        onlyAuthority
    {
        IKYCRegister kycRegisterInstance = IKYCRegister(verifierContract);
        kycRegisterInstance.submitKYC(_ipfsHash, _nid, authroity);
    }

    function grantAccess(address _verifier) public onlyAuthority {
        IKYCRegister kycRegisterInstance = IKYCRegister(verifierContract);
        kycRegisterInstance.grantAccess(_verifier);
    }

    function revokeAccess(address _verifier) public onlyAuthority {
        IKYCRegister kycRegisterInstance = IKYCRegister(verifierContract);
        kycRegisterInstance.revokeAccess(_verifier);
    }

    receive() external payable { }
    fallback() external payable { }
}
