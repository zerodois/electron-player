import express from 'express'
import createStream from './utils/stream'
import { resolve } from 'path'
import { PORT } from '../share'

const app = express()

app.get('/stream/:videoId', (req, res) => {
  let url = `https://www.youtube.com/watch?v=${req.params.videoId}`
  try {
    const stream = createStream(url)
    console.log('STREAM', req.headers.range)
    stream.on('info', data => {
      res.header('Content-Length', data.size)
      res.header('Accept-Ranges', 'bytes')
      stream.pipe(res)
    })
  } catch (exception) {
    res.status(500).send(exception)
  }
})

app.use(express.static(resolve('.', 'storage')))
app.listen(PORT, _ => console.log(`Server running in :${PORT}`))
