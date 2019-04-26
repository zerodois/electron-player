import ytdl from 'youtube-dl'
import { resolve } from 'path'
import { promisify } from 'util'
import { path } from '../../utils'

export const download = async (url) => {
  let fn = promisify(ytdl.exec).bind(ytdl)
  let output = await fn(url, ['-x', '--audio-format', 'mp3'], { cwd: resolve(path, 'storage', 'songs') })
  let thumbs = promisify(ytdl.getThumbs).bind(ytdl)
  console.log(output.join('\n'))
  let th = await thumbs(url, { all: false, cwd: resolve(path, 'storage', 'meta') })
  console.log(th)
}
