import { Router } from 'express'
import { z, ZodError } from 'zod'
import { createDance, getDance, getDances, updateDance } from './dance.service'
export const danceRouter = Router()

danceRouter.get('/', async (req, res) => {
  try {
    const dances = await getDances()
    res.send(dances)
  } catch (error) {
    handleError(res, error)
  }
})

danceRouter.get('/:id', async (req, res) => {
  try {
    const id = z.number().parse(Number(req.params.id))
    const dance = await getDance(id)
    if (!dance) return res.sendStatus(404)
    res.send(dance)
  } catch (error) {
    handleError(res, error)
  }
})

danceRouter.post('/', async (req, res) => {
  // if (req.headers.authorization !== 'Bearer 51721') return res.sendStatus(401)
  try {
    const newDance = await createDance(req.body)
    res.status(201).send(newDance)
  } catch (error) {
    handleError(res, error)
  }
})

danceRouter.patch('/:id', async (req, res) => {
  // if (req.headers.authorization !== 'Bearer 51721') return res.sendStatus(401)
  try {
    const id = z.number().parse(Number(req.params.id))
    const updatedDance = await updateDance(id, req.body)
    res.send(updatedDance)
  } catch (error) {
    handleError(res, error)
  }
})

const handleError = (res: any, error: any) => {
  if (error instanceof ZodError) {
    return res.status(400).send(error.message)
  } else if (error instanceof Error) {
    return res.status(500).send(error.message)
  } else {
    return res.sendStatus(500)
  }
}
