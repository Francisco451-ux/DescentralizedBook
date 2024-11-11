# DecentralizedBook: A Blockchain-Powered Collaborative Book

DecentralizedBook is an innovative project leveraging blockchain technology to create a collaborative book where anyone can contribute a single line of text. Each line added is immutably stored on the blockchain, ensuring that all contributions are transparent, accessible, and permanently preserved.

## Features

- **Blockchain Contributions**: Add a line to the book directly on the blockchain.
- **View the Complete Book**: Access all lines of the book stored transparently and immutably.
- **MetaMask Integration**: Connect your MetaMask wallet to interact with the smart contract.
- **Immutable Storage**: Every line added is permanently recorded on the blockchain.

## Technologies Used

- **Blockchain**: Ethereum
- **Smart Contracts**: Solidity
- **Frontend**: React (Next.js)
- **Ethereum Web3 API**: ethers.js
- **MetaMask**: Wallet integration

## Requirements

## 🛠️ Prerequisites

Before you start, make sure you have the following:

### 1. MetaMask

- Install [MetaMask](https://metamask.io/) in your browser to interact with the Hemi network.
- Configure MetaMask to use the **Hemi Sepolia Testnet** (more details below).

### 2. Node.js

- Ensure that [Node.js](https://nodejs.org/) is installed on your machine. It is required for running the local development environment and scripts.

### 3. Hemi Sepolia Testnet Tokens

- To test and interact with the NFT Marketplace, you need **Hemi Sepolia testnet tokens** (HEMI). These tokens are used to pay for gas fees on the Hemi Sepolia network.
- **Get Testnet Tokens**:
  - Go to the [Hemi Sepolia Faucet](https://faucet.hemi.network/) and request test tokens.
  - Make sure your MetaMask wallet is connected to the **Hemi Sepolia Testnet**.
  - Copy your wallet address from MetaMask and paste it into the faucet to receive HEMI tokens.

## 🌐 Configure MetaMask for Hemi Sepolia Testnet

1. Open MetaMask and go to **Settings** > **Networks** > **Add Network**.
2. Enter the following details:

   ```plaintext
   Network Name: Hemi Sepolia Testnet
   RPC URL: https://testnet.rpc.hemi.network/rpc
   Chain ID: 743111 (example, replace with the correct one)
   Symbol: HEMI
   Block Explorer URL: https://testnet.explorer.hemi.xyz

## 🏠 Run the Contract Locally

If you prefer to test the project on a local blockchain environment, follow these steps to deploy the contract using **Anvil** and update the frontend accordingly:

### 1. Start Local Blockchain

You can use **Anvil** (a local Ethereum development blockchain) to simulate a blockchain environment:

```bash
anvil
```
### Deploy the Contract Locally
Use Foundry or any other deployment tool to deploy DecentralizedBook.sol to your local Anvil blockchain. For example, using Foundry:

```bash
forge create src/DecentralizedBook.sol:DecentralizedBook --rpc-url http://127.0.0.1:8545 --private-key <your-private-key>
```

### Update the Frontend

Once the contract is deployed locally, update the contract address in the frontend code located at src/page.tsx

```tsx
const contractAddress = "0xYourLocalContractAddress";
```

## Install project dependencies:

```bash

npm install

```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
