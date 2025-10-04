# 🔐 Stark VIP

<div align="center">

**Zero-Knowledge Proof System for STRK Token Balance Verification on Starknet**

![Starknet](https://img.shields.io/badge/Starknet-Sepolia-purple?style=for-the-badge)
![Noir](https://img.shields.io/badge/Noir-ZK--SNARK-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)

Prove you own more than a threshold amount of $STRK tokens without revealing your exact balance.

[Demo](#-demo) • [Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 🎯 Overview

**Stark VIP** is a zero-knowledge proof application that enables users to prove ownership of STRK tokens above a certain threshold without revealing their exact balance. Built on Starknet, it combines cutting-edge ZK-SNARK technology with modern web infrastructure to provide privacy-preserving verification.

### Use Cases

- 🔒 **Private Token Gating**: Access exclusive groups/communities by proving token ownership
- 🎫 **Anonymous Verification**: Verify eligibility without exposing wallet balance
- 🏆 **VIP Access**: Prove you're a whale without doxxing your holdings
- 📊 **Privacy-Preserving DeFi**: Enable protocols that require balance checks without transparency

---

## ✨ Features

### 🔐 Zero-Knowledge Proofs
- Generate ZK-SNARKs using **Noir** (Aztec's ZK language)
- Prove `balance >= threshold` without revealing balance
- Ultra Honk proving system for efficient verification

### ⛓️ Starknet Integration
- On-chain verification using **Cairo** smart contracts
- **Garaga** integration for ZK proof verification on Starknet
- Support for Starknet Sepolia testnet

### 💻 Modern Web Interface
- Beautiful React 19 + TypeScript frontend
- Real-time proof generation progress
- Starknet wallet integration (ArgentX, Braavos, etc.)
- QR code generation for offline verification

### 🔒 Privacy First
- Balance never leaves your device
- Only threshold and proof are public
- Cryptographically secure nonce generation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Stark VIP System                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │              │      │              │      │           │ │
│  │   Frontend   │─────▶│  Backend API │─────▶│ Starknet  │ │
│  │  (React/TS)  │      │  (Node.js)   │      │  Sepolia  │ │
│  │              │      │              │      │           │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│         │                      │                            │
│         │                      │                            │
│         ▼                      ▼                            │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │              │      │              │                    │
│  │  Noir.js     │      │    Garaga    │                    │
│  │  (ZK Proof)  │      │  (Calldata)  │                    │
│  │              │      │              │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. **Web Prover** (`/web-prover`)
Frontend application built with React 19 and TypeScript that:
- Connects to Starknet wallets
- Fetches real STRK balance from the blockchain
- Generates ZK proofs using Noir.js and Barretenberg
- Displays proof tickets with QR codes

**Tech Stack:**
- React 19 + TypeScript
- Vite 7 (build tool)
- Tailwind CSS 4 (styling)
- @noir-lang/noir_js (ZK proof generation)
- @aztec/bb.js (Barretenberg backend)
- Starknet.js (blockchain interaction)
- Radix UI (components)

#### 2. **API Backend** (`/api`)
Node.js Express server that:
- Receives proof data from frontend
- Converts proofs to Starknet-compatible format using Garaga
- Submits verification transactions to Starknet
- Provides health check and contract info endpoints

**Tech Stack:**
- Node.js (ES Modules)
- Express 4
- Starknet.js
- Garaga CLI (proof conversion)

#### 3. **ZK Circuit** (`/zk-noir-circuit`)
Noir circuit that proves:
```rust
fn main(threshold: u64, nonce: Field, balance: u64, secret_nonce: Field) -> pub Field {
    assert(nonce == secret_nonce);  // Verify nonce authenticity
    assert(balance >= threshold);    // Prove balance >= threshold
    threshold as Field
}
```

**Tech Stack:**
- Noir (ZK circuit language)
- Nargo (Noir toolchain)

#### 4. **Cairo Verifier** (`/zk-noir-circuit/starkVIP`)
Cairo smart contract that verifies ZK proofs on Starknet:
- Ultra Honk verifier implementation
- Garaga library integration
- Deployed on Starknet Sepolia

**Tech Stack:**
- Cairo 2.11.4
- Scarb (Cairo package manager)
- Garaga 0.18.1

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** (for Garaga CLI)
- **Noir/Nargo** (for circuit compilation)
- **Starknet Wallet** (ArgentX or Braavos)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stark-VIP.git
   cd stark-VIP
   ```

2. **Install Garaga CLI**
   ```bash
   # Via Cargo (recommended)
   cargo install garaga
   
   # Verify installation
   garaga --version
   ```
   
   See [SETUP_GARAGA.md](./SETUP_GARAGA.md) for detailed instructions.

3. **Setup Backend**
   ```bash
   cd api
   npm install
   cp env.example .env
   # Edit .env with your configuration
   npm run dev
   ```
   
   See [api/README.md](./api/README.md) for API documentation.

4. **Setup Frontend**
   ```bash
   cd web-prover
   npm install
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Usage

1. **Connect Wallet**: Click "CONNECT WALLET" and approve the connection
2. **Generate Proof**: Enter a threshold and click "GENERATE PROOF"
3. **Wait**: Proof generation takes ~30-60 seconds
4. **Verify On-Chain**: Submit the proof to Starknet for verification
5. **Share**: Use the generated QR code to share your proof

---

## 📖 Documentation

### Circuit Logic

The ZK circuit proves two things:
1. **Nonce Validity**: `nonce == secret_nonce` (prevents replay attacks)
2. **Balance Threshold**: `balance >= threshold` (privacy-preserving verification)

**Public Inputs:**
- `threshold`: Minimum required balance (e.g., 100 STRK)
- `nonce`: Random value for uniqueness

**Private Inputs:**
- `balance`: Your actual STRK balance (stays secret!)
- `secret_nonce`: Must match public nonce

**Output:**
- Returns `threshold` as Field (proof of compliance)

### API Endpoints

#### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-04T12:00:00.000Z",
  "starknet": {
    "connected": true,
    "chainId": "0x534e5f5345504f4c4941"
  }
}
```

#### `POST /api/verify`
Verify a ZK proof on Starknet.

**Request:**
```json
{
  "proof": [14592, 0, 1, ...],
  "publicInputs": [],
  "verificationKey": [1764, 0, 1, ...]
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "verified": true
}
```

#### `POST /api/verify/base64`
Verify a ZK proof using base64-encoded data.

**Request:**
```json
{
  "proofB64": "base64_encoded_proof",
  "publicInputs": [],
  "verificationKeyB64": "base64_encoded_vk"
}
```

See [api/README.md](./api/README.md) for complete API documentation.

### Environment Variables

#### Backend (`/api/.env`)
```env
PORT=3001
NODE_ENV=development
STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
STARKNET_CHAIN_ID=0x534e5f5345504f4c4941
CONTRACT_ADDRESS=0x04cb6225c0fdb278ed4d6828c193f8f2edf675f0b08b04dcf972a5a0bd10f7e6
```

---

## 🛠️ Development

### Project Structure

```
stark-VIP/
├── api/                          # Backend API
│   ├── src/
│   │   ├── index.js             # Express server
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── utils/               # Utilities
│   ├── package.json
│   └── README.md
│
├── web-prover/                   # Frontend app
│   ├── src/
│   │   ├── App.tsx              # Main app component
│   │   ├── components/          # React components
│   │   ├── services/            # Proof generation
│   │   └── types/               # TypeScript types
│   ├── package.json
│   └── README.md
│
├── zk-noir-circuit/              # ZK circuit
│   ├── src/
│   │   └── main.nr              # Noir circuit
│   ├── starkVIP/                # Cairo verifier
│   │   ├── src/
│   │   │   ├── lib.cairo
│   │   │   ├── honk_verifier.cairo
│   │   │   └── ...
│   │   └── Scarb.toml
│   ├── Nargo.toml
│   └── target/
│
├── SETUP_GARAGA.md               # Garaga setup guide
└── README.md                     # This file
```

### Building the Circuit

```bash
cd zk-noir-circuit
nargo compile
```

### Compiling the Cairo Verifier

```bash
cd zk-noir-circuit/starkVIP
scarb build
```

### Running Tests

```bash
# Test Garaga integration
cd api
node test-garaga.js

# Test verification flow
node test-verification.js
```

---

## 🔬 How It Works

### Step 1: Proof Generation (Frontend)

```typescript
const inputs = {
  threshold: 100,           // Public: minimum STRK required
  nonce: "random_value",    // Public: prevents replay
  balance: 500,             // Private: your real balance
  secret_nonce: "random_value"  // Private: matches nonce
};

const proof = await generateProof(inputs);
```

### Step 2: Proof Verification (Backend + Starknet)

```javascript
// Backend converts proof using Garaga
const calldata = await garagaConvertProof(proof, vk);

// Submit to Starknet
const result = await starknetContract.verify(calldata);
```

### Step 3: On-Chain Verification (Cairo)

```cairo
fn verify_ultra_starknet_zk_honk_proof(
    proof: Span<felt252>,
    public_inputs: Span<felt252>,
) -> bool {
    // Garaga verifies the ZK proof
    // Returns true if balance >= threshold
}
```

---

## 🔐 Security Considerations

### ✅ What's Private
- Your actual STRK balance
- Your wallet address (if you choose)
- The secret_nonce

### 📢 What's Public
- The threshold value
- The nonce (for replay protection)
- The proof itself (but it reveals nothing!)

### 🛡️ Security Features
- Cryptographically secure random nonce generation
- Replay attack prevention
- Client-side proof generation (balance never sent to server)
- On-chain verification (trustless)

---

## 🧪 Testing

### Test the Complete Flow

1. **Test Garaga CLI**
   ```bash
   cd api
   node test-garaga.js
   ```

2. **Test Verification**
   ```bash
   cd api
   node test-verification.js
   ```

3. **Generate and Verify a Proof**
   - Open the frontend
   - Connect wallet
   - Generate proof
   - Verify on-chain

---

## 📚 Resources

### Starknet
- [Starknet Documentation](https://docs.starknet.io/)
- [Cairo Book](https://book.cairo-lang.org/)
- [Starknet.js](https://www.starknetjs.com/)

### Zero-Knowledge Proofs
- [Noir Documentation](https://noir-lang.org/)
- [Aztec Protocol](https://aztec.network/)
- [Garaga Library](https://github.com/keep-starknet-strange/garaga)

### Libraries
- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**Issue: "garaga: command not found"**
- Solution: Install Garaga CLI via `cargo install garaga`
- See [SETUP_GARAGA.md](./SETUP_GARAGA.md)

**Issue: "Contract not found"**
- Solution: Verify `CONTRACT_ADDRESS` in `.env`
- Ensure contract is deployed on Starknet Sepolia

**Issue: "Proof generation failed"**
- Solution: Check browser console for errors
- Ensure balance >= threshold
- Try regenerating the nonce

**Issue: "Wallet connection failed"**
- Solution: Install ArgentX or Braavos browser extension
- Switch to Starknet Sepolia network
- Refresh the page

---

## 📝 Roadmap

- [x] Basic ZK proof generation
- [x] Starknet integration
- [x] Cairo verifier contract
- [x] Frontend interface
- [x] QR code generation
- [ ] Mainnet deployment
- [ ] Mobile app
- [ ] Multi-token support
- [ ] Advanced privacy features
- [ ] Proof aggregation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by the **Stark VIP Team**

---

## 🙏 Acknowledgments

- [Starknet](https://starknet.io/) - For the amazing L2 infrastructure
- [Noir](https://noir-lang.org/) - For the ZK-SNARK framework
- [Garaga](https://github.com/keep-starknet-strange/garaga) - For ZK verification on Starknet
- [Aztec](https://aztec.network/) - For Barretenberg proving system

---

<div align="center">

**⭐ Star us on GitHub if you find this project useful! ⭐**

[Report Bug](https://github.com/yourusername/stark-VIP/issues) · [Request Feature](https://github.com/yourusername/stark-VIP/issues)

</div>

