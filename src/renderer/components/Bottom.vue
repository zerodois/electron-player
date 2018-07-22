<template>
  <section>
    <audio
      @durationchange="ev => duration = ev.target.duration"
      @timeupdate="ev => time = ev.target.currentTime"
      @ended="end()"
      ref="audio">
      <source
        :src="source"
        type="audio/mpeg">
    </audio>
    <div class="controls no-select">
      <span
        @click="setShuffle(!shuffle)"
        :class="{'active': shuffle}"
        class="pointer material-icons">shuffle</span>
      <span
        @click="prev()"
        class="pointer material-icons">skip_previous</span>
      <span
        @click="action()"
        class="pointer material-icons">{{ running ? 'pause' : 'play_arrow' }}</span>
      <span
        @click="next()"
        class="pointer material-icons">skip_next</span>
      <span
        @click="setRepeat((repeat + 1) % 3)"
        :class="{'active': repeat}"
        class="pointer material-icons">{{ repeat === 2 ? 'repeat_one' : 'repeat' }}</span>
    </div>
    <div
      @click="seek"
      class="container pointer">
      <span>{{ format(time) }}</span>
      <div class="progress">
        <div
          class="bar"
          :style="`width: ${percent}%;`"></div>
      </div>
      <span>{{ format(duration) }}</span>
    </div>
  </section>
</template>

<script>
import { PORT } from '../../share'
import { EventEmitter } from '@/utils'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Bottom',
  data () {
    return {
      source: null,
      time: 0,
      duration: 0
    }
  },
  methods: {
    ...mapActions('Player', [
      'setSong',
      'setQueue',
      'setRunning',
      'setRepeat',
      'setShuffle'
    ]),
    getUrl (item) {
      if (item.downloaded) {
        let file = `${item.snippet.title}-${item.id.videoId}.mp3`
          .replace(/["]/g, '\'')
          .replace(/\//g, '_')
          .replace(/\?/g, '')
        return `http://localhost:${PORT}/songs/${file}`
      }
      return `http://localhost:${PORT}/stream/${item.id.videoId}`
    },
    play (item) {
      this.source = this.getUrl(item)
      if (this.queue !== this.list) {
        this.setQueue(this.list)
      }
      this.setSong(item)
      this.$nextTick(_ => {
        this.$refs.audio.load()
        this.$refs.audio.play()
        this.setRunning(true)
      })
    },
    end () {
      if (this.repeat === 2) {
        return this.play(this.song)
      }
      this.next()
    },
    next () {
      if (this.index < this.queue.length - 1 || this.repeat || this.shuffle) {
        let i = this.genIndex()
        return this.play(this.queue[i])
      }
      this.action()
    },
    format (mili) {
      let secs = Math.round(mili)
      let mins = Math.floor(secs / 60)
      secs -= (60 * mins)
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    },
    prev () {
      if (this.index || this.repeat || this.shuffle) {
        return this.play(this.queue[this.genIndex(false)])
      }
    },
    genIndex (add = true) {
      if (this.shuffle) {
        return Math.round(Math.random() * (this.queue.length - 1))
      }
      if (add) {
        return (this.index + 1) % this.queue.length
      }
      let index = this.index - 1
      return index < 0 ? this.queue.length - 1 : index
    },
    action () {
      this.setRunning(!this.running)
      if (this.running) {
        return this.$refs.audio.play()
      }
      this.$refs.audio.pause()
    },
    seek (ev) {
      let seekTo = Math.round((ev.offsetX / ev.target.offsetWidth) * this.duration)
      this.$refs.audio.currentTime = seekTo
    }
  },
  computed: {
    ...mapGetters('List', { list: 'get' }),
    ...mapGetters('Player', {
      song: 'get',
      queue: 'getQueue',
      index: 'getIndex',
      running: 'getRunning',
      repeat: 'getRepeat',
      shuffle: 'getShuffle'
    }),
    percent () {
      if (!this.duration || isNaN(this.duration) || isNaN(this.time)) {
        return 0
      }
      return parseFloat((this.time / this.duration) * 100).toFixed(2)
    }
  },
  created () {
    EventEmitter.$on('song:play', this.play)
  },
  destroyed () {
    this.setRunning(false)
  }
}
</script>

<style lang="sass" scoped>
audio
  width: 0
.container
  width: $progress-size
  height: 1rem
  display: flex
  align-items: center
  > span
    font-size: .8rem
    margin: 0 .5rem
  .progress
    &, & .bar
      border-radius: 50px
    width: 100%
    height: .25rem
    background: $neutral
    .bar
      height: 100%
      width: 35%
      background: $primary-light
      position: relative
      &:after
        $pallete: 1rem
        display: block
        content: ''
        height: $pallete 
        width: $pallete
        background: #333
        border-radius: 50%
        position: absolute
        opacity: 0
        right: 0
        top: 50%
        transform: translateY(-50%) translateX(50%)
  &:hover
    .bar
      background: $primary
      &:after
        opacity: 1
.controls
  display: flex
  justify-content: center
  align-items: center
  > *
    margin: 0 .5rem .5rem .5rem
    &:not(:active):not(:focus):not(:hover):not(.active)
      opacity: .55
    &.active
      color: $primary
    &:first-child,
    &:last-child
      font-size: 1rem
    &:nth-child(3)
      font-size: 2.5rem
section
  height: $bottom-size
  width: 100%
  bottom: 0
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
</style>
