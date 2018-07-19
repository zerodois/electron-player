import ytdl from 'youtube-dl'

export const download = (url) => {
  return new Promise((resolve, reject) => {
    ytdl.exec(url, ['-x', '--audio-format', 'mp3'], { cwd: './storage' }, function (err, output) {
      if (err) {
        return reject(err)
      }
      console.log(output.join('\n'))
      resolve()
    })
  })
}
