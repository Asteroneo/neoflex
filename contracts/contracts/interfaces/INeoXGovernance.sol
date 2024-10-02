// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INeoXGovernance {
    function vote(address candidateTo) external payable;
    function transferVote(address candidateTo) external;
    function claimReward() external;
    function revokeVote() external;
}