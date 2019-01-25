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
    imageCover (quality = 'default') {
      if (!this.song) {
        return null
      }
      if (!this.song.downloaded || this.song.downloaded < 0) {
        return this.song.snippet.thumbnails.high.url
      }
      return `http://localhost:${PORT}/meta/${this.file(this.song, 'jpg')}`
    }
  }
}
