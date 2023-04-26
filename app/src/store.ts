import axios from 'axios'
import { create } from 'zustand'

interface Dance {
  id: number
  name: string
  artist: string
  stars: number
  motionData: string
  order: number
}

interface DanceStore {
  dances: Dance[]
  isFetched: boolean
  fetchDances: () => Promise<void>
}

export const backendUrl =
  location.hostname !== 'localhost' ? 'https://dance.oracle.ulassekerci.com' : 'http://localhost:5500'

export const useDanceStore = create<DanceStore>((set) => ({
  dances: [],
  isFetched: false,
  fetchDances: async () => {
    const req = await axios.get(backendUrl + '/dances')
    const dances = (req.data as Dance[]).filter((dance) => dance.order)
    set(() => ({ dances: dances, isFetched: true }))
  },
}))
