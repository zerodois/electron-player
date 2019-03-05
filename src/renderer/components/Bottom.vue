<template>
  <section>
    <div class="left">
      <template v-if="song && !config.coverExpanded">
        <img
          @click="setCover(!config.coverExpanded)"
          class="pointer cover"
          :src="imageCover('medium')"
        />
      </template>
      <div v-if="song">
        <span class="title">{{ song.snippet.title }}</span>
        <span>{{ song.snippet.channelTitle }}</span>
      </div>
    </div>
    <div class="center">
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
        @mousedown="active('progress-song', 'seek')"
        @mouseup="mouseOut('seek', 'progress-song')"
        @mouseout="mouseOut('seek', 'progress-song')"
        class="container container-progress pointer no-select">
        <span>{{ format(time) }}</span>
        <div class="progress">
          <div
            ref="progress-song"
            class="bar"
            :style="`width: ${percent}%;`"></div>
        </div>
        <span>{{ format(duration) }}</span>
      </div>
    </div>
    <div class="right flex-center no-select">
      <span class="material-icons">{{ volumeIcon }}</span>
      <div
        @click="volumeControl"
        @mousedown="active('progress-audio', 'volumeControl')"
        @mouseup="mouseOut('volumeControl', 'progress-audio')"
        @mouseout="mouseOut('volumeControl', 'progress-audio')"
        class="container-progress pointer no-select active"
        style="flex: .5">
        <div class="progress">
          <div
            ref="progress-audio"
            class="bar"
            :style="`width: ${config.volume * 100}%;`"></div>
        </div>
      </div>
    </div>
    <audio
      @durationchange="ev => duration = ev.target.duration"
      @timeupdate="ev => time = ev.target.currentTime"
      @ended="end()"
      :volume="config.volume"
      ref="audio">
      <source
        :src="source"
        type="audio/mpeg">
    </audio>
  </section>
</template>

<script>
import { PORT } from '../../share'
import { EventEmitter } from '@/utils'
import { mapActions, mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
import mixin from '@/mixins'

export default {
  name: 'Bottom',
  mixins: [mixin],
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
    ...mapActions('Config', {
      setCover: 'setCoverExpanded',
      setVolume: 'setVolume'
    }),
    getUrl (item) {
      if (item.downloaded > 0) {
        let file = this.file(item)
        return `http://localhost:${PORT}/songs/${file}`
      }
      return `http://localhost:${PORT}/stream/${item.id.videoId || item.id}`
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
    active (ref, fn) {
      const $ref = this.$refs[ref]
      $ref.addEventListener('mousemove', this[fn])
    },
    mouseOut (fn, ref) {
      const $ref = this.$refs[ref]
      $ref.removeEventListener('mousemove', this[fn])
    },
    volumeControl (ev) {
      const $ref = this.$refs['progress-audio'].parentNode
      const perc = Math.min(1, Math.max(0, ev.offsetX / $ref.offsetWidth))
      this.setVolume(perc)
      this.$refs.audio.volume = perc
    },
    seek (ev) {
      const $ref = this.$refs['progress-song'].parentNode
      let seekTo = Math.round((ev.offsetX / $ref.offsetWidth) * this.duration)
      this.$refs.audio.currentTime = seekTo
    }
  },
  computed: {
    ...mapGetters('Config', { config: 'get' }),
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
    },
    volumeIcon () {
      const vol = this.config.volume
      if (!vol) {
        return 'volume_off'
      }
      if (vol < 0.2) {
        return 'volume_mute'
      }
      if (vol < 0.7) {
        return 'volume_down'
      }
      return 'volume_up'
    }
  },
  created () {
    EventEmitter.$on('song:play', this.play)
    ipcRenderer.on('keyboard:next', _ => this.next())
    ipcRenderer.on('keyboard:prev', _ => this.prev())
    ipcRenderer.on('keyboard:playpause', _ => this.action())
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
.container-progress
  height: 1rem
  display: flex
  align-items: center
  > span
    font-size: .8rem
    margin: 0 .5rem
  .progress
    margin: 0 .5rem
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
  &:hover, &.active
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
  display: grid
  grid-template-columns: 3fr 10fr 3fr
  .left
    display: flex
    max-width: $sidebar-size
    box-sizing: border-box
    padding: 0 1rem
    align-items: center
    font-size: .85rem
    .cover
      margin-right: .5rem
      $sz: 3.5rem
      border-radius: 3px
      height: $sz
      width: $sz
      object-fit: cover
    > div
      flex: 1
      min-width: 0
    .title
      display: block
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
      font-size: 1rem
      font-weight: 500
  .center
    height: $bottom-size
    width: 100%
    bottom: 0
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
</style>
