import youtubedl from 'youtube-dl'

export default (url, start) => {
  const video = youtubedl(url, ['--format=18'], { start, cwd: '.' })
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
