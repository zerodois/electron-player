import youtubedl from 'youtube-dl'

export default url => {
  const video = youtubedl(url, ['--format=18'], { start: 0, cwd: __dirname })
  video.on('info', info => {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
  })
  video.on('complete', info => {
    console.log('filename: ' + info._filename + ' already downloaded.')
  })
  video.on('end', () => {
    console.log('finished downloading!')
  })
  return video
}
