// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INeoXGovernance {
    function vote(address candidateTo) external payable;
}

contract DummyVoter {
    INeoXGovernance public governanceContract;
    address public currentValidator;

    event VoteAttempted(address validator, uint256 amount);
    event VoteSucceeded(address validator, uint256 amount);
    event VoteFailed(address validator, uint256 amount, string reason);

    constructor(address _governanceContract, address _initialValidator) {
        require(_governanceContract != address(0), "Invalid governance contract address");
        require(_initialValidator != address(0), "Invalid initial validator address");
        governanceContract = INeoXGovernance(_governanceContract);
        currentValidator = _initialValidator;
    }

    function vote() external payable {
        require(msg.value > 0, "Must send some GAS to vote");
        emit VoteAttempted(currentValidator, msg.value);

        try governanceContract.vote{value: msg.value}(currentValidator) {
            emit VoteSucceeded(currentValidator, msg.value);
        } catch Error(string memory reason) {
            emit VoteFailed(currentValidator, msg.value, reason);
        } catch (bytes memory /*lowLevelData*/) {
            emit VoteFailed(currentValidator, msg.value, "Low level error");
        }
    }

    function updateValidator(address newValidator) external {
        require(newValidator != address(0), "Invalid new validator address");
        currentValidator = newValidator;
    }

    // Function to withdraw any GAS that might be stuck in the contract
    function withdraw() external {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    // Function to allow the contract to receive GAS
    receive() external payable {}
}