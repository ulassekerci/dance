import axios from 'axios'
import { create } from 'zustand'

interface Dance {
  id: number
  name: string
  artist: string
  stars: number
  motionData: string
}

interface DanceStore {
  dances: Dance[]
  isFetched: boolean
  fetchDances: () => Promise<void>
}

export const backendUrl = process.env.VERCEL ? 'https://dance.oracle.ulassekerci.com' : 'http://localhost:5500'

export const useDanceStore = create<DanceStore>((set) => ({
  dances: [],
  isFetched: false,
  fetchDances: async () => {
    const req = await axios.get(backendUrl + '/dances')
    const dances = req.data
    set(() => ({ dances: dances, isFetched: true }))
  },
}))
