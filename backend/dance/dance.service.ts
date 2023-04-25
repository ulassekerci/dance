import { z } from 'zod'
import { prisma } from '../db'

export const getDances = () => {
  return prisma.dance.findMany({
    orderBy: { order: 'asc' },
  })
}

export const getDance = (id: number) => {
  return prisma.dance.findUnique({ where: { id } })
}

export const createDance = (dance: z.infer<typeof danceType>) => {
  const data = danceType.parse(dance)
  return prisma.dance.create({ data })
}

export const updateDance = (id: number, dance: z.infer<typeof danceType>) => {
  const data = danceType.parse(dance)
  return prisma.dance.update({ where: { id }, data })
}

const danceType = z.object({
  name: z.string(),
  artist: z.string(),
  stars: z.number().min(0).max(5).default(0),
  motionData: z.string().optional(),
})
