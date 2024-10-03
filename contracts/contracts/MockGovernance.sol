// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/INeoXGovernance.sol";

contract MockGovernance is INeoXGovernance {
    uint256 public reward;

    function vote(address candidateTo) external payable override {}

    function transferVote(address candidateTo) external override {}

    function claimReward() external override {
        payable(msg.sender).transfer(reward);
        reward = 0;
    }

    function revokeVote() external override {}

    // Function to set reward for testing
    function setReward(uint256 _reward) external payable {
        reward = _reward;
    }

    receive() external payable {}
}