export default {
  methods: {
    file (item, ext = 'mp3') {
      return `${item.snippet.title}-${item.id.videoId}.${ext}`
        .replace(/:/g, ' -')
        .replace(/["]/g, '\'')
        .replace(/\//g, '_')
        .replace(/\?/g, '')
    }
  }
}
