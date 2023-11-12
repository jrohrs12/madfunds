// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

contract FundraiserContract {
    struct Fundraiser {
        string name;
        uint goal;
        uint current;
    }

    mapping(uint => Fundraiser) public fundraisers;

    constructor(uint _id, string memory _name, uint _goal) {
        fundraisers[_id] = Fundraiser({name: _name, goal: _goal, current: 0});
    }

    function getFundraiser(uint _id) public view returns (Fundraiser memory) {
        return fundraisers[_id];
    }
}