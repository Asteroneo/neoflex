# NeoFlex: Revolutionizing Liquid Staking on Neo X 🚀

## 📚 Project Overview

NeoFlex is an innovative liquid staking solution designed for the Neo X blockchain. Our platform allows users to stake their GAS tokens while maintaining liquidity through our xGAS tokens. This enables participants to earn staking rewards while still having the flexibility to use their assets in other DeFi applications.

## 🔍 The Problem

Currently, Neo X requires users to lock up their GAS tokens to participate in network governance and earn rewards. This creates an opportunity cost, as staked assets cannot be used elsewhere in the ecosystem. Moreover, the process of selecting validators and managing stakes can be complex for average users.

## 💡 Our Solution

NeoFlex introduces a user-friendly liquid staking platform that simplifies the staking process and unlocks the potential of staked assets. Here's how it works:

1. Users deposit GAS into the NeoFlex smart contract.
2. They receive xGAS tokens representing their staked GAS plus accrued rewards.
3. NeoFlex manages the staking process, optimizing for the best rewards.
4. Users can freely trade or use xGAS in other DeFi applications.
5. At any time, users can burn their xGAS to retrieve their original GAS plus rewards.

## 🗓 Roadmap

1. **Phase 1: MVP Launch** (End of Hackathon)

   - Basic deposit/withdraw functionality
   - Integration with existing Neo X validators

2. **Phase 2: Enhanced Features** (Q4 2024)

   - Implement advanced staking strategies
   - Launch governance token for protocol decisions

3. **Phase 3: Ecosystem Expansion** (Q1 2025)

   - Integrate xGAS with other DeFi protocols on Neo X
   - Launch our own validator node to increase validator numbers
   - Develop cross-chain bridges for xGAS

4. **Phase 4: Multi-Chain Expansion** (Q2 2025)
   - Extend NeoFlex to other compatible blockchains
   - Implement cross-chain liquid staking

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/neoflex.git
   cd neoflex
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
   NEXT_PUBLIC_NFT_ADDRESS=
   NEXT_PUBLIC_XGAS_ADDRESS=
   NEXT_PUBLIC_CORE_ADDRESS=
   NEXT_PUBLIC_API_URL=
   ```

   Fill in the appropriate values for each variable.

4. Run the development server:

   ```
   yarn run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Smart Contracts

The smart contracts are located in the `contracts/` folder. They use the Hardhat framework for development and testing.

## 🛠 Tech Stack

- Next.js framework
- Tailwind CSS for styling
- RainbowKit and wagmi for Web3 integration
- Radix UI for user interface components

## 🤝 Contributing

We welcome contributions to NeoFlex! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- The Neo X community for their support and feedback
- OpenZeppelin for their secure smart contract libraries
- All contributors and testers who have helped shape NeoFlex
