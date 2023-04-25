import express from 'express'
import cors from 'cors'
import { danceRouter } from './dance/dance.router'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/dances', danceRouter)

app.listen(5500, () => {
  console.log('Server started on port 5500')
})
