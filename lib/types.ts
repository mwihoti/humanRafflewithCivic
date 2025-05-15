export interface Raffle {
  id: string
  title: string
  description: string
  prize: string
  endDate: string
  imageUrl?: string
  participants: string[]
  status: "active" | "completed"
  winner?: string
}


export interface Winner {
  address: string
  ensName?: string
  avatarUrl?: string
  rank: number
  prize: string
  date?: string
}