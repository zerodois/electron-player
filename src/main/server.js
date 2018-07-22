import express from 'express'
import stream from './utils/stream'
import { resolve } from 'path'
import { PORT } from '../share'

const app = express()

app.get('/stream/:videoId', (req, res) => {
  let url = `https://www.youtube.com/watch?v=${req.params.videoId}`
  try {
    stream(url).pipe(res)
  } catch (exception) {
    res.status(500).send(exception)
  }
})

app.use(express.static(resolve('.', 'storage')))
app.listen(PORT, _ => console.log(`Server running in :${PORT}`))
