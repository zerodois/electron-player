import mime from 'mime-types'
import moment from 'moment'
import mpris from 'mpris-service'

const player = mpris({
  name: 'quark',
  identity: 'Quark',
  desktopEntry: 'quark',
  canRaise: true,
  supportedUriSchemes: ['file', 'data'],
  supportedMimeTypes: ['.mp3'].map(mime.lookup).filter(Boolean),
  supportedInterfaces: ['player']
})

/**
 * Load configs to mpris
 */
export const load = () => {
  player.canEditTracks = false
  player.playbackStatus = 'Stopped'
}

/**
 * Update system info
 * @param {object} track
 * @param {object} track.snippet
 */
export const update = ({ snippet, contentDetails }) => {
  const duration = moment
    .duration(contentDetails.duration)
    .asMilliseconds()
  const metadata = {
    'mpris:trackid': player.objectPath('track/0'),
    'mpris:length': Math.ceil(duration * 1000), // should be in microseconds
    'mpris:artUrl': `${snippet.thumbnails.default.url}`,
    'xesam:title': snippet.title,
    'xesam:album': 'Sem álbum',
    'xesam:artist': [snippet.channelTitle]
  }
  console.log('METADATA', metadata)
  player.playbackStatus = 'Playing'
  player.canPlay = true
  player.canPause = true
  player.canGoPrevious = true
  player.canGoNext = true
  player.metadata = metadata
}
