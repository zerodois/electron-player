import ytdl from 'youtube-dl'
import path from 'path'
import { promisify } from 'util'

export const download = async (url) => {
  let fn = promisify(ytdl.exec).bind(ytdl)
  let output = await fn(url, ['-x', '--audio-format', 'mp3'], { cwd: path.resolve(__static, 'storage', 'songs') })
  let thumbs = promisify(ytdl.getThumbs).bind(ytdl)
  console.log(output.join('\n'))
  let th = await thumbs(url, { all: false, cwd: path.resolve(__static, 'storage', 'meta') })
  console.log(th)
}
