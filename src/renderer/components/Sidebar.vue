<template>
  <section class="sidebar">
    <div class="logo">
      <img src="/static/images/logo.svg" alt="">
      <span>Quark</span>
    </div>
    <nav>
      <div
        v-for="(route, $index) in routes"
        :key="$index"
        class="link">
        <router-link
          exact
          :to="route.path">
          <span class="material-icons">
            {{ route.icon }}
          </span>
          <span>
            {{ route.title }}
          </span>
        </router-link>
      </div>
    </nav>
    <div class="bottom">
      <div class="img">
        <img
          v-if="image"
          :src="image"
          alt="">
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { PORT } from '../../share'
import mixin from '@/mixins'

const routes = [
  { title: 'Navegar', path: '/', icon: 'home' },
  { title: 'Minhas músicas', path: '/songs', icon: 'music_note' }
]

export default {
  name: 'Sidebar',
  mixins: [mixin],
  data () {
    return {
      routes
    }
  },
  computed: {
    ...mapGetters('Player', {
      song: 'get'
    }),
    image () {
      if (!this.song) {
        return null
      }
      if (!this.song.downloaded) {
        return this.song.snippet.thumbnails.medium.url
      }
      return `http://localhost:${PORT}/meta/${this.file(this.song, 'jpg')}`
    }
  }
}
</script>

<style lang="sass" scoped>
.link
  a
    $icon: 24px
    display: grid
    grid-gap: .5rem
    grid-template-columns: 3fr 7fr
    border-top-right-radius: 100px
    border-bottom-right-radius: 100px
    width: 95%
    font-weight: 500
    padding: .75rem 0
    font-size: 13px
    &:hover
      background: $neutral
    &.active, &:active, &:focus
      font-weight: 600
      color: $primary
      background: $primary-light
    > *
      align-self: center
    > .material-icons
      font-size: $icon
      justify-self: center
.sidebar
  height: 100%
  width: $sidebar-size
  display: flex
  flex-direction: column
  .bottom
    flex: 1
    display: flex
    justify-content: center
    align-items: flex-end
    .img
      height: $sidebar-size
      background: gold
      img
        object-fit: cover
        height: 100%
  .logo
    display: flex
    justify-content: flex-start
    align-items: center
    margin-bottom: 2rem
    span
      color: $dark-light
      font-weight: 300
      font-size: 2rem
      font-family: $logo-font
    img
      height: 3.5rem
      margin: 1rem .5rem 1rem 1.5rem
</style>
