// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/**
 * @title KYCRegistryV3
 * @author Sagar Karmoker
 * @notice Deployed KYCRegistry contract
 * @dev KYCRegistry contract hold the KYC data and verification status.
 * @dev Current version: V3
 * @dev This contract is deployed and used by WalletContractV1 contract.
 * @dev WalletContractV1 contract hold the nid and wallet shard3 mapping.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./KYCRegisterV2.sol";

contract KYCRegistryV3 is Initializable, KYCRegistry {
    // ORG -> [citizen1, citizen2, citizen3....]
    // Mapping from organization to list of citizens
    mapping(address => address[]) public orgToCitizens;

    // Grant access to a verifier
    function grantAccess(address _verifier) public override {
        require(listOfVerifier[_verifier], "Verifier not found in list");
        verifierPermissions[msg.sender][_verifier] = true;
        userGrantedAccess[msg.sender].push(_verifier);
        orgToCitizens[_verifier].push(msg.sender);
        emit VerifierAccessGranted(msg.sender, _verifier);
    }

    // Revoke access from a verifier
    function revokeAccess(address _verifier) public override {
        require(listOfVerifier[_verifier], "Verifier not found in list");
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
