// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

import "./CitizenWallet.sol";
import "./KYCRegisterV2.sol";

interface ICitizenWallet {
    function executeTransction(
        address destinationAddress,
        string memory data,
        bytes32[] calldata proof
    ) external returns (bytes memory);

    function verifyRecoveryContact(
        bytes32[] memory proof,
        address recoveryContact
    ) external view returns (bool);

    function submitKYC(string memory _ipfsHash, uint256 _nid) external;

    function grantAccess(address _verifier) external;

    function revokeAccess(address _verifier) external;

    function transferFund(address _to, uint256 amount)
        external
        returns (bytes memory);

    function updateMerkleRoot(bytes32 _merkleRoot) external returns (bool);
}

contract CitizenWalletFactory {
    address public relayer;
    address public authority;
    address public verifierContract;

    // NID -> address
    mapping(uint256 => address) public Citizens;
    mapping(uint256 => bytes32) public CitizenInfo;
    address[] citizenWallets;
    //mapping (uint => uint) hashedNonce;

    mapping(uint256 => bool) public isBlocked;

    event NewCitizenWalletCreated(
        uint256 indexed NID,
        address indexed citizenWalletAddress
    );

    constructor(address _relayer, address _verifierContract) {
        relayer = _relayer;
        authority = msg.sender;
        verifierContract = _verifierContract;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "You are not the relayer");
        _;
    }

    modifier onlyAuthority() {
        require(msg.sender == authority, "You are not the authority");
        _;
    }

    function createCitizenWallet(uint256 _NID, bytes32 _merkleRoot)
        public
        onlyRelayer
        returns (address)
    {
        require(Citizens[_NID] == address(0), "Citizen already has a wallet");
        CitizenWallet newCitizenWallet = new CitizenWallet(
            _NID,
            relayer,
            _merkleRoot,
            verifierContract
        );
        Citizens[_NID] = address(newCitizenWallet);
        // CitizenInfo[_NID] = "store other info of user"
        citizenWallets.push(address(newCitizenWallet));
        emit NewCitizenWalletCreated(_NID, address(newCitizenWallet));
        return address(newCitizenWallet);
    }

    function blockCitizen(uint256 _NID) public onlyAuthority {
        isBlocked[_NID] = true;
    }

    function unblockCitizen(uint256 _NID) public onlyAuthority {
        isBlocked[_NID] = false;
    }

    function executeTransction(
        bytes32[] calldata proof,
        address destinationAddress,
        string memory data,
        uint256 _NID,
        bytes32 newRoot
    ) public onlyRelayer returns (bytes memory) {
        require(!isBlocked[_NID], "Citizen is blocked");
        ICitizenWallet citizenWalletInstance = ICitizenWallet(Citizens[_NID]);
        require(citizenWalletInstance.updateMerkleRoot(newRoot), "Update failed");
        require(
            citizenWalletInstance.verifyRecoveryContact(proof, Citizens[_NID]),
            "Invalid proof or not authorized."
        );
        bytes memory result = citizenWalletInstance.executeTransction(
            destinationAddress,
            data,
            proof
        );
        return result;
    }

    function submitKYC(
        string memory _ipfsHash,
        uint256 _nid,
        bytes32[] calldata proof,
        bytes32 newRoot
    ) public {
        ICitizenWallet citizenWalletInstance = ICitizenWallet(Citizens[_nid]);
        require(citizenWalletInstance.updateMerkleRoot(newRoot), "Update failed");
        require(
            citizenWalletInstance.verifyRecoveryContact(proof, address(citizenWalletInstance)),
            "Proof verification failed"
        );
        citizenWalletInstance.submitKYC(_ipfsHash, _nid);
    }

    function grantAccess(address _verifier, uint256 _nid, bytes32[] calldata proof, bytes32 newRoot) public {
        ICitizenWallet citizenWalletInstance = ICitizenWallet(Citizens[_nid]);
        require(citizenWalletInstance.updateMerkleRoot(newRoot), "Update failed");
        require(
            citizenWalletInstance.verifyRecoveryContact(proof, address(citizenWalletInstance)),
            "Proof verification failed"
        );
        citizenWalletInstance.grantAccess(_verifier);
    }

    function revokeAccess(address _verifier, uint256 _nid, bytes32[] calldata proof, bytes32 newRoot) public {
        ICitizenWallet citizenWalletInstance = ICitizenWallet(Citizens[_nid]);
        require(citizenWalletInstance.updateMerkleRoot(newRoot), "Update failed");
        require(
            citizenWalletInstance.verifyRecoveryContact(proof, address(citizenWalletInstance)),
            "Proof verification failed"
        );
        citizenWalletInstance.revokeAccess(_verifier);
    }

    function transferFund(
        address _to,
        uint256 amount,
        bytes32[] calldata proof,
        uint _nid,
        bytes32 newRoot
    ) public {
        ICitizenWallet citizenWalletInstance = ICitizenWallet(Citizens[_nid]);
        require(citizenWalletInstance.updateMerkleRoot(newRoot), "Update failed");
        require(
            citizenWalletInstance.verifyRecoveryContact(proof, address(citizenWalletInstance)),
            "Proof verification failed"
        );
        citizenWalletInstance.transferFund(_to, amount);
    }

    function getWalletAddresses() public onlyRelayer view returns (address[] memory) {
        return citizenWallets;
    }
}
