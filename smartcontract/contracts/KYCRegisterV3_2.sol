// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/**
 * @title KYCRegistryV3_2
 * @author Sagar Karmoker
 * @notice Deployed KYCRegistry contract
 * @dev KYCRegistry contract hold the KYC data and verification status.
 * @dev Current version: V3.1
 * @dev This contract is deployed and used by WalletContractV1 contract.
 * @dev WalletContractV1 contract hold the nid and wallet shard3 mapping.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./KYCRegisterV3_1.sol";

contract KYCRegistryV32 is Initializable, KYCRegistryV31 {
    // Grant access to a verifier
    function grantAccess(address _verifier) public override {
        require(listOfVerifier[_verifier], "Verifier not found in list");
        require(!grantAccessCheck(_verifier), "Already added");
        verifierPermissions[msg.sender][_verifier] = true;
        userGrantedAccess[msg.sender].push(_verifier);
        orgToCitizens[_verifier].push(msg.sender);
        emit VerifierAccessGranted(msg.sender, _verifier);
    }

    // check before grant access if the address is already pushed or not
    function grantAccessCheck(address _verifier) public view returns (bool) {
        require(listOfVerifier[_verifier], "Verifier not found in list");
        address[] storage citizens = orgToCitizens[_verifier];
        for (uint i = 0; i < citizens.length; i++) {
            if (citizens[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    // Revoke access from a verifier
    function revokeAccess(address _verifier) public override {
        require(listOfVerifier[_verifier], "Verifier not found in list");
        require(verifierPermissions[msg.sender][_verifier], "Access not granted");
        require(grantAccessCheck(_verifier), "Access not granted");
        verifierPermissions[msg.sender][_verifier] = false;
        address[] storage citizens = orgToCitizens[_verifier];

        for (uint i = 0; i < citizens.length; i++) {
            if (citizens[i] == msg.sender) {
                // Move the last element into the place to delete
                citizens[i] = citizens[citizens.length - 1];
                // Remove the last element
                citizens.pop();
                return;
            }
        }
        emit VerifierAccessRevoked(msg.sender, _verifier);
        // If the function reaches here, the citizen was not found in the array
        revert("Citizen not found");
    }
}
