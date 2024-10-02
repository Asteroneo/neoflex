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
    address public currentValidator;
    uint256 public lastRewardClaim;
    uint256 public accumulatedRewards;

    event Deposited(address indexed user, uint256 gasAmount, uint256 xGasAmount);
    event UnstakeRequested(address indexed user, uint256 xGasAmount, uint256 nftId);
    event Withdrawn(address indexed user, uint256 gasAmount);
    event ValidatorUpdated(address indexed newValidator);
    event RewardsHarvested(uint256 amount);

    constructor(address _governanceContract, address _xGASToken, address _unstakeNFT) {
        xGASToken = XGASToken(_xGASToken);
        governanceContract = INeoXGovernance(_governanceContract);
        unstakeNFT = UnstakeNFT(_unstakeNFT);
        lastRewardClaim = block.timestamp;
    }

    function deposit() external payable nonReentrant whenNotPaused {
        harvestRewards();
        require(msg.value > 0, "Deposit amount must be greater than 0");

        uint256 xGasToMint = getGasToXGasRatio(msg.value);
        totalStaked += msg.value;

        xGASToken.mint(msg.sender, xGasToMint);

        emit Deposited(msg.sender, msg.value, xGasToMint);

        if (currentValidator != address(0)) {
            governanceContract.vote{value: msg.value}(currentValidator);
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

    function harvestRewards() public {
        if (block.timestamp > lastRewardClaim) {
            uint256 balanceBefore = address(this).balance;
            governanceContract.claimReward();
            uint256 newRewards = address(this).balance - balanceBefore;
            accumulatedRewards += newRewards;
            lastRewardClaim = block.timestamp;
            emit RewardsHarvested(newRewards);
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

    function updateValidator(address newValidator) external onlyOwner {
        require(newValidator != address(0), "Invalid validator address");
        require(newValidator != currentValidator, "New validator must be different from current");
        
        if (currentValidator != address(0)) {
            governanceContract.transferVote(newValidator);
        } else {
            governanceContract.vote{value: address(this).balance}(newValidator);
        }
        
        currentValidator = newValidator;
        
        emit ValidatorUpdated(newValidator);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}
}