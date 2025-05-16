# HumanRaffle - Civic Auth Raffle Platform

![HumanRaffle Banner](/public/raffle.jpeg?height=300&width=800&text=HumanRaffle)

HumanRaffle is a decentralized raffle platform that uses Civic Auth to verify human participants, ensuring fair and bot-free raffles. The platform allows users to browse, enter, and win raffles with transparent drawing mechanisms and on-chain payments.

## 🚀 Features

- **Civic Auth Integration**: Verify users are real humans before entering raffles
- **Civic Embedded Wallet**: Wallet is automatically created after user signs in with Civic Auth
- **On-Chain Payments**: Enter raffles by sending ETH directly to the treasury
- **Prize Pools**: Dynamic prize pools that grow with each entry
- **NFT Tickets**: Receive a commemorative NFT ticket for each raffle entry
- **Live Countdown**: Real-time countdown timers for active raffles
- **Winner Selection**: Transparent and fair winner selection process
- **Winners Board**: Showcase of top winners with their prizes and rankings
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Civic Auth for human verification
- **Blockchain**: wagmi, viem for Ethereum interactions
- **Animations**: Framer Motion for smooth animations
- **Icons**: Lucide React for beautiful icons

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Civic Auth account and app ID
- A WalletConnect project ID
- An Ethereum wallet (MetaMask, WalletConnect, etc.)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mwihoti/humanRafflewithCivic.git
   cd humanRafflewithCivic
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_CIVIC_APP_ID=your_civic_app_id
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_RAFFLE_TREASURY_ADDRESS=your_treasury_wallet_address
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CIVIC_APP_ID` | Your Civic Auth application ID | Yes |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | Your WalletConnect project ID | Yes |
| `NEXT_PUBLIC_RAFFLE_TREASURY_ADDRESS` | Ethereum address where raffle entry fees are sent | Yes |



## 📱 Key Features and Flows

### Raffle Entry Process

The raffle entry process is a core feature of the platform:

1. **Authentication**: Users sign in with Civic Auth to verify they are human
2. **Wallet Creation**: A Civic embedded wallet is automatically created during the sign-in process 
3. **Raffle Selection**: Users browse and select a raffle they want to enter
4. **Payment**: Users make an ETH payment to enter the raffle
   - Minimum entry amount is 0.001 ETH
   - Larger contributions may increase winning chances (if enabled)
5. **Confirmation**: After payment confirmation, the user receives an NFT ticket
6. **Winner Selection**: When the raffle ends, a winner is randomly selected



### Payment Flow

The payment flow uses wagmi hooks to interact with the Ethereum blockchain:

1. User clicks "Enter Raffle" button
2. Payment dialog opens with configurable ETH amount
3. User confirms payment, triggering an Ethereum transaction
4. Application monitors transaction status
5. On successful confirmation, the user's entry is recorded
6. User receives an NFT ticket and confetti celebration

### Wallet Integration

The platform exclusively uses Civic's embedded wallet:

- **Automatic Wallet Creation**: Wallet is automatically created when users sign in with Civic Auth
- **No External Wallets**: Users don't need to connect external wallets like MetaMask
- **Seamless Experience**: The wallet creation process is handled behind the scenes

The wallet component displays:
- Connection status
- Wallet address (shortened with copy option)
- ETH balance with low balance warning


## 🔄 Civic Auth Integration

HumanRaffle uses Civic Auth for:

1. **Human Verification**: Ensuring participants are real people
2. **Wallet Creation**: Helping users without wallets create one
3. **Secure Authentication**: Providing a secure login experience

The integration is handled through:
- `useUser` hook from `@civic/auth-web3/react`
- `userHasWallet` utility from `@civic/auth-web3`
- Automatic wallet creation during authentication


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Civic Auth](https://www.civic.com/) for identity verification
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [wagmi](https://wagmi.sh/) for Ethereum interactions
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide React](https://lucide.dev/) for icons
