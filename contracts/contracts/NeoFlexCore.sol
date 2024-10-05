// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./xGASToken.sol";
import "./interfaces/INeoXGovernance.sol";
import "./UnstakeNFT.sol";

contract NeoFlexCore is ReentrancyGuard, Pausable, Ownable {
    XGASToken public xGASToken;
    INeoXGovernance public governanceContract;
    UnstakeNFT public unstakeNFT;

    uint256 public totalStaked;
    uint256 public constant UNSTAKE_PERIOD = 2 weeks;
    uint256 public constant EPOCH_DURATION = 7 days;
    address public currentValidator;
    uint256 public lastRewardClaim;
    uint256 public lastVoteTimestamp;
    uint256 public accumulatedRewards;

    event Deposited(address indexed user, uint256 gasAmount, uint256 xGasAmount);
    event UnstakeRequested(address indexed user, uint256 xGasAmount, uint256 nftId);
    event Withdrawn(address indexed user, uint256 gasAmount);
    event ValidatorUpdated(address indexed newValidator);
    event RewardsHarvested(uint256 amount);
    event GovernanceContractUpdated(address indexed oldGovernance, address indexed newGovernance);
    event DebugLog(string message, uint256 value);
    event ErrorLog(string message, string reason);

    constructor(address _governanceContract, address _currentValidator, address _xGASToken, address _unstakeNFT) {
        require(_governanceContract != address(0), "Invalid governance contract address");
        require(_currentValidator != address(0), "Invalid validator address");
        require(_xGASToken != address(0), "Invalid xGASToken address");
        require(_unstakeNFT != address(0), "Invalid unstakeNFT address");

        xGASToken = XGASToken(_xGASToken);
        governanceContract = INeoXGovernance(_governanceContract);
        currentValidator = _currentValidator;
        unstakeNFT = UnstakeNFT(_unstakeNFT);
        lastRewardClaim = block.timestamp;

        // Initial vote for the current validator
        if (address(this).balance > 0) {
            governanceContract.vote{value: address(this).balance}(_currentValidator);
        }
    }


    function deposit() external payable nonReentrant whenNotPaused {
        require(msg.value > 1, "Deposit amount must be greater than 1");
        emit DebugLog("Deposit started", msg.value);

        if (lastVoteTimestamp == 0) {
            lastVoteTimestamp = block.timestamp;
            emit DebugLog("First deposit, setting lastVoteTimestamp", lastVoteTimestamp);
        } else {
            bool rewardsHarvested = harvestRewards();
            if (rewardsHarvested) {
                emit DebugLog("Rewards harvested during deposit", 0);
            } else {
                emit DebugLog("No rewards harvested during deposit", 0);
            }
        }

        uint256 xGasToMint = getGasToXGasRatio(msg.value);
        totalStaked += msg.value;

        try xGASToken.mint(msg.sender, xGasToMint) {
            emit DebugLog("xGAS minted successfully", xGasToMint);
        } catch Error(string memory reason) {
            emit ErrorLog("xGAS minting failed", reason);
            revert("xGAS minting failed");
        }

        emit Deposited(msg.sender, msg.value, xGasToMint);

        if (currentValidator != address(0)) {
            try governanceContract.vote{value: msg.value}(currentValidator) {
                lastVoteTimestamp = block.timestamp;
                emit DebugLog("Vote successful", msg.value);
            } catch Error(string memory reason) {
                emit ErrorLog("Voting failed", reason);
                revert("Voting failed");
            } catch (bytes memory /*lowLevelData*/) {
                emit ErrorLog("Voting failed", "Low level error");
                revert("Voting failed due to low level error");
            }
        } else {
            emit DebugLog("No validator set", 0);
        }
    }

    function requestUnstake(uint256 xGasAmount) external nonReentrant whenNotPaused {
        harvestRewards();
        require(xGasAmount > 0, "Unstake amount must be greater than 0");
        require(xGASToken.balanceOf(msg.sender) >= xGasAmount, "Insufficient xGAS balance");

        uint256 gasAmount = getXGasToGasRatio(xGasAmount);
        require(gasAmount <= totalStaked, "Insufficient staked amount");

        xGASToken.burn(msg.sender, xGasAmount);
        totalStaked -= gasAmount;
        
        uint256 nftId = unstakeNFT.mint(msg.sender, gasAmount);

        emit UnstakeRequested(msg.sender, xGasAmount, nftId);
    }

    function claimUnstake(uint256 nftId) external nonReentrant whenNotPaused {
        harvestRewards();
        UnstakeNFT.UnstakeRequest memory request = unstakeNFT.getUnstakeRequest(nftId);
        require(request.user == msg.sender, "Not the owner of this unstake request");
        require(block.timestamp >= request.mintTime + UNSTAKE_PERIOD, "Unstake period not elapsed");

        unstakeNFT.burn(nftId);

        payable(msg.sender).transfer(request.amount);

        emit Withdrawn(msg.sender, request.amount);
    }

    // Function to withdraw any GAS that might be stuck in the contract
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }



    function harvestRewards() internal returns (bool) {
        if (block.timestamp < lastVoteTimestamp + EPOCH_DURATION) {
            emit DebugLog("Rewards not yet claimable", block.timestamp);
            return false;  // Indicate that no rewards were harvested
        }
        
        uint256 balanceBefore = address(this).balance;
        
        try governanceContract.claimReward() {
            uint256 newRewards = address(this).balance - balanceBefore;
            accumulatedRewards += newRewards;
            lastRewardClaim = block.timestamp;
            emit RewardsHarvested(newRewards);
            return true;  // Indicate successful reward harvesting
        } catch Error(string memory reason) {
            emit ErrorLog("Claim reward failed", reason);
            return false;  // Indicate that reward claiming failed
        } catch (bytes memory /*lowLevelData*/) {
            emit ErrorLog("Claim reward failed", "Low level error");
            return false;  // Indicate that reward claiming failed due to a low-level error
        }
    }

    function getGasToXGasRatio(uint256 gasAmount) public view returns (uint256) {
        if (totalStaked == 0) return gasAmount;
        return (gasAmount * xGASToken.totalSupply()) / (totalStaked + accumulatedRewards);
    }

    function getXGasToGasRatio(uint256 xGasAmount) public view returns (uint256) {
        if (xGASToken.totalSupply() == 0) return 0;
        return (xGasAmount * (totalStaked + accumulatedRewards)) / xGASToken.totalSupply();
    }

    function addAccumulatedRewards() external payable onlyOwner {
    require(msg.value > 0, "Must send ETH to add to accumulated rewards");
    accumulatedRewards += msg.value;
    emit DebugLog("Accumulated rewards increased", msg.value);
    }


    function updateValidator(address newValidator) external onlyOwner {
        require(newValidator != address(0), "Invalid validator address");
        require(newValidator != currentValidator, "New validator must be different from current");
        
        if (currentValidator != address(0)) {
            governanceContract.transferVote(newValidator);
        }
        
        currentValidator = newValidator;
        
        emit ValidatorUpdated(newValidator);
    }

    
    function updateGovernanceContract(address _newGovernanceContract) external onlyOwner {
        require(_newGovernanceContract != address(0), "New governance contract address cannot be zero");
        require(_newGovernanceContract != address(governanceContract), "New address must be different from current");

        address oldGovernanceContract = address(governanceContract);
        governanceContract = INeoXGovernance(_newGovernanceContract);

        emit GovernanceContractUpdated(oldGovernanceContract, _newGovernanceContract);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}
}