# Biblock Entry - Athlete Registration System

A privacy-preserving athlete registration system built with Fully Homomorphic Encryption (FHE) using the FHEVM protocol by Zama. This system allows athletes to register their personal information (name, age, contact details, sport category) in an encrypted manner, ensuring that sensitive data remains private while still being verifiable on-chain.

## ✨ Features

- **Privacy-First Design**: All athlete data is encrypted using FHE and can only be decrypted by the athlete's private key
- **Complete Registration Flow**: Submit, view, and decrypt athlete information
- **Multi-Network Support**: Works on local development networks and testnets (Sepolia)
- **Modern Frontend**: Built with Next.js, TypeScript, and Rainbow wallet integration
- **Comprehensive Testing**: Full test coverage for local and testnet environments

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm or yarn/pnpm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   cd frontend
   npm install
   cd ..
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC

   # Set your Infura API key for network access
   npx hardhat vars set INFURA_API_KEY

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile and test contracts**

   ```bash
   npm run compile
   npm run test
   ```

4. **Deploy to local network**

   ```bash
   # Option 1: Start a full FHEVM-enabled Hardhat node (recommended for full functionality)
   npx hardhat node --fhevm

   # Option 2: Start standard Hardhat node (works but with limited FHE functionality)
   npx hardhat node

   # Deploy to local network
   npx hardhat deploy --network localhost
   ```

   **Note**: The FHEVM-enabled node (`--fhevm` flag) provides full FHE encryption/decryption capabilities. The standard node will still work but with limited functionality and warnings in the console.

5. **Start the frontend**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Deploy to Sepolia Testnet** (Optional)

   ```bash
   # Deploy to Sepolia
   npx hardhat deploy --network sepolia
   # Verify contract on Etherscan
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   # Test on Sepolia
   npx hardhat test --network sepolia
   ```

## 🎯 Usage

### Frontend Application

1. Connect your wallet using the Rainbow wallet button in the top right
2. **Register Athlete**: Fill out the registration form with your personal information
3. **View My Data**: Switch to the "View My Data" tab to see your encrypted information and decrypt it

### Command Line Tasks

```bash
# Get contract address
npx hardhat --network localhost task:address

# Register an athlete
npx hardhat --network localhost task:register-athlete --name "John Doe" --age 25 --contact "john@example.com" --sport 1

# Get athlete information
npx hardhat --network localhost task:get-athlete-info

# Decrypt athlete data
npx hardhat --network localhost task:decrypt-athlete-data

# Update athlete information
npx hardhat --network localhost task:update-athlete --name "Jane Doe" --age 26 --contact "jane@example.com" --sport 2
   ```

## 📁 Project Structure

```
biblock-entry/
├── contracts/                    # Smart contract source files
│   └── AthleteRegistration.sol  # Athlete registration contract with FHE
├── deploy/                       # Deployment scripts
├── tasks/                        # Hardhat custom tasks for athlete operations
├── test/                         # Test files for local and testnet
├── frontend/                     # Next.js frontend application
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── abi/                      # Contract ABIs and addresses
│   └── fhevm/                    # FHEVM utilities and hooks
├── hardhat.config.ts             # Hardhat configuration
└── package.json                  # Dependencies and scripts
```

## 🏆 Sport Categories

The system supports the following sport categories:

1. **Individual Sports** - Sports competed individually (e.g., tennis, swimming)
2. **Team Sports** - Sports played in teams (e.g., soccer, basketball)
3. **Endurance Sports** - Long-distance activities (e.g., running, cycling)
4. **Combat Sports** - Competitive fighting sports (e.g., boxing, martial arts)
5. **Other** - Any other sport category

## 🔐 Privacy & Security

- **Fully Homomorphic Encryption**: All athlete data is encrypted on-chain using FHE
- **Private Key Access**: Only the athlete can decrypt their own data using their private key
- **Zero-Knowledge Proofs**: Input proofs ensure encrypted data validity without revealing content
- **On-Chain Verification**: Contract can perform operations on encrypted data without decryption

## 📜 Available Scripts

### Root Directory
| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run compile`  | Compile all contracts                |
| `npm run test`     | Run contract tests                   |
| `npm run coverage` | Generate test coverage report        |
| `npm run lint`     | Run linting checks                   |
| `npm run clean`    | Clean build artifacts                |

### Frontend Directory
| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start development server             |
| `npm run build`    | Build for production                 |
| `npm run start`    | Start production server              |
| `npm run lint`     | Run frontend linting                 |

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)
- [Rainbow Wallet Documentation](https://docs.rainbow.me/)

## 🤝 Business Value

This athlete registration system provides:

- **Youth Sports Protection**: Safeguards sensitive information for young athletes
- **Privacy Compliance**: Meets data protection requirements for sports organizations
- **Decentralized Trust**: No central authority can access athlete data without permission
- **Global Accessibility**: Athletes can register from anywhere in the world

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/zama-ai/fhevm/issues)
- **FHEVM Documentation**: [Zama Docs](https://docs.zama.ai)
- **Community**: [Zama Discord](https://discord.gg/zama)

---

**Built with ❤️ using Zama's FHEVM technology**
