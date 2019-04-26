import express from 'express'
import createStream from './utils/stream'
import { resolve } from 'path'
import { PORT } from '../share'
import { path } from './utils'
import { get } from 'lodash'

const app = express()

app.get('/stream/:videoId', (req, res) => {
  let url = `https://www.youtube.com/watch?v=${req.params.videoId}`
  try {
    const def = 'bytes=0-'
    console.log('RANGE', req.headers.range)
    const [start, rest] = get(req, 'headers.range', def)
      .replace(/^bytes=/i, '')
      .split('-')
      .map(n => parseInt(n, 10))
    const stream = createStream(url, start)
    stream.on('info', data => {
      const total = data.size + start
      const end = rest || (total - 1)
      res.status(206)
      res.header('Content-Range', `bytes ${start}-${end}/${total}`)
      res.header('Accept-Ranges', 'bytes')
      res.header('Content-Length', data.size)
      stream.pipe(res)
    })
  } catch (exception) {
    console.error(exception)
    res.status(500).send({ error: exception.message })
  }
})

app.use(express.static(resolve(path, 'storage')))
app.listen(PORT, _ => console.log(`Server running in :${PORT}`))
