# NeoFlex Liquid Staking System Documentation

## Overview

NeoFlex is a liquid staking solution for the Neo X blockchain. It allows users to stake their GAS tokens and receive xGAS tokens in return, which represent their staked GAS plus accrued rewards. This system enables users to participate in network validation and earn rewards while maintaining liquidity.

## Smart Contracts

The NeoFlex system consists of four main smart contracts:

1. NeoFlexCore
2. XGASToken
3. UnstakeNFT
4. INeoXGovernance (interface for interacting with the Neo X Governance contract)

### NeoFlexCore

This is the main contract that handles the core logic of the liquid staking system.

#### Key Functions:

- `deposit()`: Allows users to stake GAS and receive xGAS tokens.
- `requestUnstake(uint256 xGasAmount)`: Initiates the unstaking process for a user.
- `claimUnstake(uint256 nftId)`: Allows users to claim their unstaked GAS after the unstaking period.
- `harvestRewards()`: Claims rewards from the Neo X Governance contract.
- `updateValidator(address newValidator)`: Updates the validator that the contract votes for.

#### Key Variables:

- `totalStaked`: Total amount of GAS staked in the contract.
- `accumulatedRewards`: Total rewards accumulated from staking.
- `currentValidator`: Address of the current validator being voted for.

### XGASToken

An ERC20 token representing staked GAS plus accrued rewards.

#### Key Functions:

- `mint(address to, uint256 amount)`: Mints new xGAS tokens.
- `burn(address from, uint256 amount)`: Burns xGAS tokens.

### UnstakeNFT

An ERC721 token representing unstaking requests.

#### Key Functions:

- `mint(address user, uint256 amount)`: Mints a new NFT for an unstaking request.
- `burn(uint256 tokenId)`: Burns an NFT after the unstaking request is fulfilled.
- `getUnstakeRequest(uint256 tokenId)`: Retrieves details of an unstaking request.

### INeoXGovernance

An interface for interacting with the Neo X Governance contract.

#### Key Functions:

- `vote(address candidateTo)`: Votes for a validator.
- `transferVote(address candidateTo)`: Transfers vote to a new validator.
- `claimReward()`: Claims staking rewards.

## Contract Interactions

1. When a user deposits GAS:

   - NeoFlexCore receives the GAS.
   - NeoFlexCore mints xGAS tokens to the user via XGASToken.
   - NeoFlexCore votes for the current validator using INeoXGovernance.

2. When a user requests to unstake:

   - NeoFlexCore burns the user's xGAS tokens via XGASToken.
   - NeoFlexCore mints an UnstakeNFT to the user.

3. When a user claims unstaked GAS:

   - NeoFlexCore verifies the UnstakeNFT and the unstaking period.
   - NeoFlexCore burns the UnstakeNFT.
   - NeoFlexCore transfers the unstaked GAS to the user.

4. Periodically or during user interactions:
   - NeoFlexCore claims rewards from the Neo X Governance contract via INeoXGovernance.

## General Logic

1. **Staking**: Users stake GAS and receive xGAS. The amount of xGAS minted is calculated based on the current ratio of total staked GAS (including accumulated rewards) to total xGAS supply.

2. **Reward Accumulation**: Rewards are not distributed directly to users. Instead, they accumulate in the contract, increasing the value of xGAS relative to GAS over time.

3. **Unstaking**: When users unstake, they burn xGAS and receive GAS. The amount of GAS received is calculated based on the current ratio of total staked GAS (including accumulated rewards) to total xGAS supply. This ensures that users benefit from accumulated rewards proportional to their stake.

4. **Validator Management**: The contract votes for a single validator. This can be updated by the contract owner, allowing for optimal validator selection.

5. **Unstaking Period**: To align with Neo X's unstaking mechanics, there's a mandatory waiting period between requesting an unstake and being able to claim the unstaked GAS.

6. **NFTs for Unstaking**: Unstaking requests are represented as NFTs, allowing for easy tracking and management of pending unstaking requests.

## Key Formulas

1. GAS to xGAS ratio (when staking):

   ```
   xGAS = (GAS * total_xGAS_supply) / (total_staked_GAS + accumulated_rewards)
   ```

2. xGAS to GAS ratio (when unstaking):
   ```
   GAS = (xGAS * (total_staked_GAS + accumulated_rewards)) / total_xGAS_supply
   ```

These formulas ensure that the value of xGAS increases over time as rewards accumulate, benefiting all xGAS holders proportionally.

## Security Considerations

- The contract uses OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks.
- The contract is Pausable, allowing for emergency stops if needed.
- Only the contract owner can update the validator or pause/unpause the contract.
- The unstaking process uses a two-step approach (request and claim) with a mandatory waiting period to align with Neo X's unstaking mechanics.

## Conclusion

The NeoFlex liquid staking system provides a user-friendly way to participate in Neo X staking while maintaining liquidity. By accumulating rewards in the contract and adjusting the xGAS to GAS ratio, it ensures fair distribution of rewards to all participants based on their stake and duration.
