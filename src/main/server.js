import express from 'express'
import createStream from './utils/stream'
import { resolve } from 'path'
import { PORT } from '../share'
import { get } from 'lodash'

const app = express()

app.get('/stream/:videoId', (req, res) => {
  let url = `https://www.youtube.com/watch?v=${req.params.videoId}`
  try {
    const [, start] = /^bytes=(\d+)-/i.test(get(req, 'headers.range', def))
    const stream = createStream(url, Number(start))
    const def = 'bytes=0'
    stream.pipe(res)
    stream.on('info', data => {
      res.header('Content-Length', data.size)
      res.header('Accept-Ranges', 'bytes')
    })
  } catch (exception) {
    res.status(500).send(exception)
  }
})

app.use(express.static(resolve('.', 'storage')))
app.listen(PORT, _ => console.log(`Server running in :${PORT}`))
