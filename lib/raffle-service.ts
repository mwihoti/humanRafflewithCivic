"use server"

import type { Raffle } from "./types"

// Mock data store - in a real app, this would be a database
const raffles: Raffle[] = [
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

// Get all raffles or filter by type
export async function getRaffles(type: "active" | "entered" | "past" | "all"): Promise<Raffle[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // TODO: Replace with MongoDB query
  // Example MongoDB query:
  // const raffles = await db.collection('raffles').find({ status: type === 'active' ? 'active' : 'completed' }).toArray()

  if (type === "all") {
    return raffles
  }

  if (type === "active") {
    return raffles.filter((raffle) => raffle.status === "active")
  }

  if (type === "past") {
    return raffles.filter((raffle) => raffle.status === "completed")
  }

  if (type === "entered") {
    // TODO: Replace with MongoDB query filtering by user's wallet address
    // Example MongoDB query:
    // const raffles = await db.collection('raffles').find({ participants: walletAddress }).toArray()

    // For demo purposes, return a subset of raffles
    return raffles.filter((_, index) => index % 2 === 0)
  }

  return []
}

// Get a single raffle by ID
export async function getRaffleById(id: string): Promise<Raffle | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // TODO: Replace with MongoDB query
  // Example MongoDB query:
  // const raffle = await db.collection('raffles').findOne({ id })

  const raffle = raffles.find((r) => r.id === id)
  return raffle || null
}

// Get participants for a raffle
export async function getRaffleParticipants(raffleId: string): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // TODO: Replace with MongoDB query
  // Example MongoDB query:
  // const raffle = await db.collection('raffles').findOne({ id: raffleId })
  // return raffle ? raffle.participants : []

  const raffle = raffles.find((r) => r.id === raffleId)

  if (!raffle) {
    return []
  }

  // If no real participants yet, generate some mock ones for display
  if (raffle.participants.length === 0) {
    return Array(5)
      .fill(0)
      .map(() => `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`)
  }

  return raffle.participants
}

// Check if a user has entered a raffle
export async function checkIfEntered(raffleId: string, walletAddress: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  // TODO: Replace with MongoDB query
  // Example MongoDB query:
  // const entry = await db.collection('entries').findOne({ raffleId, walletAddress })
  // return !!entry

  const raffle = raffles.find((r) => r.id === raffleId)

  if (!raffle) {
    return false
  }

  return raffle.participants.includes(walletAddress)
}

// Enter a raffle
export async function enterRaffle(raffleId: string, walletAddress: string): Promise<void> {
  // Simulate API delay and blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // TODO: Replace with MongoDB transaction and smart contract call
  // Example MongoDB transaction:
  // await db.collection('entries').insertOne({
  //   raffleId,
  //   walletAddress,
  //   timestamp: new Date(),
  //   transactionHash: '0x...' // From smart contract
  // })
  // await db.collection('raffles').updateOne(
  //   { id: raffleId },
  //   { $addToSet: { participants: walletAddress } }
  // )

  const raffleIndex = raffles.findIndex((r) => r.id === raffleId)

  if (raffleIndex === -1) {
    throw new Error("Raffle not found")
  }

  // Check if user has already entered
  if (raffles[raffleIndex].participants.includes(walletAddress)) {
    throw new Error("Already entered")
  }

  // Add user to participants
  raffles[raffleIndex].participants.push(walletAddress)

  // In a real app, this would:
  // 1. Call a smart contract to record the entry
  // 2. Mint an NFT ticket for the participant
  // 3. Emit an event for tracking

  // Smart contract call would look like:
  // const contract = new ethers.Contract(RAFFLE_CONTRACT_ADDRESS, RAFFLE_ABI, signer);
  // const tx = await contract.enterRaffle(raffleId);
  // await tx.wait();
}

// Draw a winner for a raffle
export async function drawWinner(raffleId: string): Promise<string> {
  // Simulate API delay and blockchain transaction
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // TODO: Replace with MongoDB transaction and smart contract call
  // Example MongoDB transaction:
  // const winner = await callSmartContractForWinner(raffleId);
  // await db.collection('raffles').updateOne(
  //   { id: raffleId },
  //   { $set: { status: 'completed', winner } }
  // )

  const raffleIndex = raffles.findIndex((r) => r.id === raffleId)

  if (raffleIndex === -1) {
    throw new Error("Raffle not found")
  }

  const raffle = raffles[raffleIndex]

  if (raffle.status !== "active") {
    throw new Error("Raffle is not active")
  }

  if (raffle.participants.length === 0) {
    throw new Error("No participants")
  }

  // Randomly select a winner
  const winnerIndex = Math.floor(Math.random() * raffle.participants.length)
  const winner = raffle.participants[winnerIndex]

  // Update raffle status
  raffles[raffleIndex] = {
    ...raffle,
    status: "completed",
    winner,
  }

  // In a real app, this would:
  // 1. Call a smart contract with a verifiable random function
  // 2. Transfer the prize to the winner
  // 3. Emit an event for tracking

  // Smart contract call would look like:
  // const contract = new ethers.Contract(RAFFLE_CONTRACT_ADDRESS, RAFFLE_ABI, signer);
  // const tx = await contract.drawWinner(raffleId);
  // await tx.wait();
  // const winner = await contract.getRaffleWinner(raffleId);

  return winner
}

// Get all entries with timestamps (for admin panel)
export async function getRaffleEntries(raffleId: string): Promise<{ address: string; timestamp: string }[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // TODO: Replace with MongoDB query
  // Example MongoDB query:
  // const entries = await db.collection('entries')
  //   .find({ raffleId })
  //   .sort({ timestamp: -1 })
  //   .toArray();
  // return entries.map(entry => ({
  //   address: entry.walletAddress,
  //   timestamp: entry.timestamp
  // }));

  const raffle = raffles.find((r) => r.id === raffleId)

  if (!raffle) {
    return []
  }

  // Generate mock timestamps for demo purposes
  return raffle.participants.map((address) => ({
    address,
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
  }))
}
