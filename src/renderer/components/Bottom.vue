<template>
  <section>
    <audio
      ref="audio"
      controls>
      <source :src="source" type="audio/mpeg">
    </audio>
  </section>
</template>

<script>
import { PORT } from '../../share'
import { EventEmitter } from '@/utils'

export default {
  name: 'Bottom',
  data () {
    return {
      source: null
    }
  },
  methods: {
    play (item) {
      let file = `${item.snippet.title}-${item.id.videoId}.mp3`
        .replace(/["]/g, '\'')
        .replace(/\//g, '_')
        .replace(/\?/g, '')
      let url = `http://localhost:${PORT}/${file}`
      this.source = url
      this.$nextTick(_ => {
        this.$refs.audio.load()
        this.$refs.audio.play()
      })
      console.log('TOCASAPORRA', file)
    }
  },
  created () {
    EventEmitter.$on('song:play', this.play)
  }
}
</script>

<style lang="sass" scoped>
section
  background: $dark-light
  height: $bottom-size
  width: 100%
  bottom: 0
</style>
