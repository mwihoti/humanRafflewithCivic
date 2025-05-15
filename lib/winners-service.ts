"use server"

import type { Winner } from "./types"

// Mock data - in a real app, this would come from your database
export async function getTopWinners(): Promise<Winner[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock winners data
  return [
    {
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      ensName: "winner.eth",
      rank: 1,
      prize: "5 ETH + Exclusive NFT",
      date: "2023-05-10",
    },
    {
      address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      ensName: "crypto-lover.eth",
      rank: 2,
      prize: "2 ETH",
      date: "2023-05-10",
    },
    {
      address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
      ensName: "blockchain-fan.eth",
      rank: 3,
      prize: "1 ETH",
      date: "2023-05-10",
    },
    {
      address: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
      rank: 4,
      prize: "0.5 ETH",
      date: "2023-05-10",
    },
  ]
}
