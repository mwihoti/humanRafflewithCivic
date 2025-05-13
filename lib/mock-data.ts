// This file contains mock data for the application
// In a production environment, this would be replaced with MongoDB or another database

import type { Raffle } from "./types"

// Mock raffles data
export const mockRaffles: Raffle[] = [
  {
    id: "raffle-1",
    title: "Exclusive NFT Giveaway",
    description:
      "Win a limited edition NFT from a renowned digital artist. Only verified humans can participate in this exclusive giveaway.",
    prize: "Limited Edition NFT",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    imageUrl: "/placeholder.svg?height=300&width=500",
    participants: [],
    status: "active",
  },
  {
    id: "raffle-2",
    title: "Crypto Conference Tickets",
    description: "Win two VIP tickets to the upcoming blockchain conference in your city. Transportation not included.",
    prize: "2x VIP Conference Tickets",
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    imageUrl: "/placeholder.svg?height=300&width=500",
    participants: [],
    status: "active",
  },
  {
    id: "raffle-3",
    title: "Hardware Wallet Giveaway",
    description: "Keep your crypto secure with a brand new hardware wallet. Only one lucky winner will be selected.",
    prize: "Secure Hardware Wallet",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    imageUrl: "/placeholder.svg?height=300&width=500",
    participants: [],
    status: "active",
  },
  {
    id: "raffle-past-1",
    title: "Past Raffle: 1 ETH Giveaway",
    description: "This raffle has already concluded. The winner received 1 ETH directly to their wallet.",
    prize: "1 ETH",
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    imageUrl: "/placeholder.svg?height=300&width=500",
    participants: ["0x123...456", "0x789...012", "0xabc...def"],
    status: "completed",
    winner: "0x789...012",
  },
]

// MongoDB Schema Examples (for future implementation)

/*
// User Schema
{
  _id: ObjectId,
  walletAddress: String,
  isVerified: Boolean,
  verificationDate: Date,
  role: String, // "user" or "admin"
  createdAt: Date,
  updatedAt: Date
}

// Raffle Schema
{
  _id: ObjectId,
  id: String, // public ID
  title: String,
  description: String,
  prize: String,
  endDate: Date,
  imageUrl: String,
  status: String, // "active" or "completed"
  winner: String, // wallet address of winner
  createdAt: Date,
  updatedAt: Date
}

// Entry Schema
{
  _id: ObjectId,
  raffleId: String,
  walletAddress: String,
  transactionHash: String, // from blockchain
  timestamp: Date,
  createdAt: Date
}
*/

// Smart Contract Interface Example (for future implementation)

/*
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRaffleContract {
    function enterRaffle(string calldata raffleId) external;
    function drawWinner(string calldata raffleId) external returns (address);
    function getRaffleWinner(string calldata raffleId) external view returns (address);
    function getParticipants(string calldata raffleId) external view returns (address[] memory);
    function hasEntered(string calldata raffleId, address participant) external view returns (bool);
}
*/
