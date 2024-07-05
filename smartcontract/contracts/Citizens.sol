// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Citizens {
    address public authority;
    address public relayer;

    struct Citizen {
        string uuid;
        string passHash;
        string recoveryEmailHash;
    }

    modifier onlyAuthority() {
        require(msg.sender == authority, "You are not the authority");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == relayer, "You are not the relayer");
        _;
    }

    mapping (string => Citizen) citizens;
    string[] public citizenKeys;

    constructor(address _relayer) {
        authority = msg.sender;
        relayer = _relayer;
    }

    function updateRelayer(address _relayer) public onlyAuthority {
        relayer = _relayer;
    }

    function registation(string memory _uuid, string memory _passhash, string memory _recovery) public  onlyRelayer {
        require(bytes(citizens[_uuid].uuid).length == 0, "User already exists");
        citizens[_uuid] = Citizen(_uuid, _passhash, _recovery);
        citizenKeys.push(_uuid);
    }

    function recovery(string memory _uuid, string memory _passhash) public onlyRelayer {
        require(bytes(citizens[_uuid].uuid).length != 0, "User not found");
        citizens[_uuid] = Citizen(citizens[_uuid].uuid, _passhash, citizens[_uuid].recoveryEmailHash);
    }

    function getCitizens() public onlyRelayer view returns(Citizen[] memory) {
        Citizen[] memory _citizens = new Citizen[](citizenKeys.length);
        for (uint i = 0; i < citizenKeys.length; i++) {
            _citizens[i] = citizens[citizenKeys[i]];
        }
        return _citizens;
    }
}