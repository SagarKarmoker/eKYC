// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/**
 * @title KYCRegistryV3_1
 * @author Sagar Karmoker
 * @notice Deployed KYCRegistry contract
 * @dev KYCRegistry contract hold the KYC data and verification status.
 * @dev Current version: V3.1
 * @dev This contract is deployed and used by WalletContractV1 contract.
 * @dev WalletContractV1 contract hold the nid and wallet shard3 mapping.
 */

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./KYCRegisterV3.sol";

contract KYCRegistryV31 is Initializable, KYCRegistryV3 {
    // Get all the access addresses
    function getOrgAccessKYC(address _org) public view returns (address[] memory) {
        require(listOfVerifier[_org], "Verfier not found");
        return orgToCitizens[_org];
    }
}
