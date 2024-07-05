// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/**
 * @title KYCRegistryV2
 * @author Sagar Karmoker
 * @notice Deployed KYCRegistry contract
 * @dev KYCRegistry contract hold the KYC data and verification status.
 * @dev Current version: V2.1
 * @dev This contract is deployed and used by WalletContractV1 contract.
 * @dev WalletContractV1 contract hold the nid and wallet shard3 mapping.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface IWalletContract {
    function getWalletOwner(uint _nid) external view returns (address);
}

contract KYCRegistry is Initializable {
    address public authority;

    // Structure to hold KYC data reference
    struct KYCData {
        string ipfsHash; // IPFS hash of the KYC document
        bool verified; // Verification status
        uint time; // KYC document submission time
    }

    // Mapping from user wallet address to their KYC data
    mapping(address => KYCData[]) kycData;

    // Mapping the verifier (Financial Inst., NBR and others)
    mapping(address => bool) public listOfVerifier;

    // Mapping for verifier permissions (verifier address => user address => has access)
    mapping(address => mapping(address => bool)) public verifierPermissions;

    // Granted access to verifier
    mapping(address => address[]) public userGrantedAccess;

    // Wallet owner mapping
    IWalletContract public walletContract;

    // one time call
    function initialize() public initializer {
        authority = msg.sender;
    }

    modifier onlyAuthority{
        require(msg.sender == authority, "Only authority");
        _;
    }

    modifier onlyVerifier{
        require(listOfVerifier[msg.sender], "Verifier not found in list");
        _;
    }

    // Event declarations
    event KYCSubmitted(address indexed user, string ipfsHash);
    event KYCVerified(address indexed user, bool verified);
    event VerifierAccessGranted(address indexed user, address verifier);
    event VerifierAccessRevoked(address indexed user, address verifier);

    // Add verifier
    function addVerifier(address _verifier) onlyAuthority public {
        listOfVerifier[_verifier] = true;
    }

    // Block verifier
    function disableVerifier(address _verifier) onlyAuthority public {
        listOfVerifier[_verifier] = false;
    }

    function getKYCDataCount(address user) internal view returns (uint) {
        // Return the number of KYCData records for a given user
        return kycData[user].length;
    }

    // Verifier get KYC data
    function getKYCData(address _user) onlyVerifier public view returns (KYCData memory) {
        require(verifierPermissions[_user][msg.sender] == true, "Not authorized to verify");
        uint latest = getKYCDataCount(_user);
        require(latest > 0, "No KYC data available for this user.");
        return kycData[_user][latest-1];
    }

    // Submit KYC data
    function submitKYC(string memory _ipfsHash, uint _nid) public {
        require(getWalletOwner(_nid) == msg.sender, "Not authorized to submit KYC data");
        kycData[msg.sender].push(KYCData(_ipfsHash, false, block.timestamp));
        emit KYCSubmitted(msg.sender, _ipfsHash);
    }

    // Verify KYC data
    function verifyKYC(address _user, bool _verified) public onlyVerifier {
        require(verifierPermissions[_user][msg.sender] == true, "Not authorized to verify");
        uint latest = getKYCDataCount(_user);
        require(latest > 0, "No KYC data available for this user.");
        kycData[_user][latest-1].verified = _verified;
        emit KYCVerified(_user, _verified);
    }

    // Grant access to a verifier
    function grantAccess(address _verifier) public {
        require(listOfVerifier[_verifier], "Verifier not found in list");
        verifierPermissions[msg.sender][_verifier] = true;
        userGrantedAccess[msg.sender].push(_verifier);
        emit VerifierAccessGranted(msg.sender, _verifier);
    }

    // Revoke access from a verifier
    function revokeAccess(address _verifier) public {
        require(listOfVerifier[_verifier], "Verifier not found in list");
        verifierPermissions[msg.sender][_verifier] = false;
        emit VerifierAccessRevoked(msg.sender, _verifier);
    }


    // Calling external functions
    function setWalletContract(address _walletContract) public onlyAuthority {
        walletContract = IWalletContract(_walletContract);
    }

    function getWalletOwner(uint _nid) public view returns (address) {
        return walletContract.getWalletOwner(_nid);
    }
}
