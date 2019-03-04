import { PORT } from '../../share'

export default {
  methods: {
    file (item, ext = 'mp3') {
      return `${item.snippet.title}-${item.id.videoId}.${ext}`
        .replace(/:/g, ' -')
        .replace(/["]/g, '\'')
        .replace(/\//g, '_')
        .replace(/\?/g, '')
    },
    imageCover (quality = 'default', _song = null) {
      const song = _song || this.song
      if (!song) {
        return null
      }
      if (!song.downloaded || song.downloaded < 0) {
        return song.snippet.thumbnails.high.url
      }
      return `http://localhost:${PORT}/meta/${this.file(song, 'jpg')}`
    }
  }
}
