# NeoFlex Smart Contracts

## 🚨 Important Notice: Testnet Use and Audit Requirements

### Testnet Only

**Please note that these smart contracts are currently in development and are intended for use on testnets only.** They have not been deployed to any mainnet environment. Developers and users should interact with these contracts solely on designated Neo X testnets for development, testing, and demonstration purposes.

## 🛠 Smart Contracts Overview

### NeoFlexCore.sol

This is the main contract that handles the core functionality of the NeoFlex protocol:

- Manages deposits of GAS tokens
- Handles unstaking requests
- Interacts with the Neo X Governance contract for voting and reward claiming
- Mints and burns xGAS tokens
- Manages the unstaking NFTs

Key functions:

- `deposit()`: Allows users to deposit GAS and receive xGAS tokens
- `requestUnstake(uint256 xGasAmount)`: Initiates the unstaking process
- `claimUnstake(uint256 nftId)`: Allows users to claim their unstaked GAS after the waiting period
- `harvestRewards()`: Claims rewards from the governance contract

### XGASToken.sol

This is an ERC20 token contract representing the liquid staking token (xGAS):

- Implements standard ERC20 functionality
- Allows minting and burning by the operator (NeoFlexCore contract)

### UnstakeNFT.sol

This ERC721 contract manages the unstaking process:

- Mints NFTs representing unstaking requests
- Stores information about each unstake request (amount, time, user)
- Allows burning of NFTs when unstaking is complete

## 💡 Overall Logic and NFT Usage

1. **Staking Process**:

   - Users deposit GAS into the NeoFlexCore contract.
   - The contract mints an equivalent amount of xGAS tokens based on the current exchange rate.
   - The deposited GAS is used to vote for the current validator in the Neo X Governance contract.

2. **Reward Distribution**:

   - The NeoFlexCore contract periodically harvests rewards from the governance contract.
   - These rewards are added to the total staked amount, effectively increasing the value of xGAS tokens.

3. **Unstaking Process**:

   - When a user wants to unstake, they call `requestUnstake()` with their xGAS amount.
   - The xGAS tokens are burned, and an UnstakeNFT is minted to the user.
   - The NFT represents a claim on the unstaked GAS and includes information about the amount and time of the request.
   - After a waiting period (2 weeks), the user can call `claimUnstake()` with their NFT ID to receive their GAS.

4. **NFT Usage**:

   - The UnstakeNFT serves as a non-transferable receipt for the unstaking request.
   - It ensures that users must wait for the required period before withdrawing their GAS.
   - The NFT is burned when the unstaking is completed, preventing double-claims.

5. **Security Measures**:
   - The contracts use OpenZeppelin's `ReentrancyGuard` and `Pausable` to prevent common vulnerabilities.
   - Access control is implemented using `Ownable` and custom `onlyOperator` modifiers.
   - Events are emitted for all important actions to facilitate off-chain monitoring and indexing.

## 🔍 Key Considerations

- The exchange rate between GAS and xGAS is dynamic and depends on the total staked amount and accumulated rewards.
- The system assumes a single validator for simplicity, but this can be extended to support multiple validators in future versions.
- The unstaking period is currently set to 2 weeks, which may need adjustment based on Neo X governance rules.
- Proper testing and auditing are crucial, especially for the reward distribution and unstaking mechanisms.

## 🚀 Next Steps

1. Implement comprehensive unit tests for all contracts.
2. Conduct integration tests with a Neo X testnet.
3. Implement a governance mechanism for parameter updates and contract upgrades.
4. Design and implement a more sophisticated validator selection strategy.
5. Prepare contracts for professional security audit.

Remember, these contracts are a work in progress and should not be used in production without thorough testing and auditing.
