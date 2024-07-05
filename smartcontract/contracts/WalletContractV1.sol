// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @title WalletContract
 * @author Sagar Karmoker
 * @notice updated with Interface IWalletContract
 * @dev WalletContract contract hold the nid and wallet shard3 mapping.
 * @dev Current version: V2
 */

interface IWalletContract {
    function registerWalletOwner(uint _nid, address _walletOwner) external;
}

contract WalletContract is Initializable {
    address public deployer;
    address[] public admins;

    // nid => shard3
    mapping (uint => string) public wallets;

    // Intance of WalletContract
    IWalletContract public walletContract;

    function initialize(address _deployer) public initializer {
        deployer = _deployer;
    }

    modifier onlyDeployer() {
        require(msg.sender == deployer, "Only deployer can call this function");
        _;
        
    }

    modifier onlyDeployerOrAdmins() {
        require(msg.sender == deployer || isAdmin(msg.sender), "Only deployer or admins can call this function");
        _;
    }

    function isAdmin(address _admin) public view returns (bool) {
        for (uint i = 0; i < admins.length; i++) {
            if (admins[i] == _admin) {
                return true;
            }
        }
        return false;
    }

    function updateDeployer(address _newDeployer) public onlyDeployer {
        deployer = _newDeployer;
    }

    function setWallet(uint _nid, string memory _shard3) public onlyDeployerOrAdmins {
        wallets[_nid] = _shard3;
    }

    function getWallet(uint _nid) public view returns (string memory)  {
        return wallets[_nid];
    }

    function removeWallet(uint _nid) public onlyDeployerOrAdmins {
        delete wallets[_nid];
    }

    function updateWallet(uint _nid, string memory _shard3) public onlyDeployerOrAdmins {
        wallets[_nid] = _shard3;
    }

    // external function calling
    function setWalletContract(address _walletContract) external onlyDeployer {
        walletContract = IWalletContract(_walletContract);
    }

    function registerWalletOwner(uint _nid, address _walletOwner) external onlyDeployerOrAdmins {
        walletContract.registerWalletOwner(_nid, _walletOwner);
    }
}