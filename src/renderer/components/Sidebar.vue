<template>
  <section class="sidebar">
    <div class="logo">
      <img src="/static/images/logo.svg" alt="">
      <span>Quark.</span>
    </div>
    <nav class="scroll">
      <div
        v-for="(route, $index) in routes"
        :key="$index"
        class="link">
        <router-link
          v-if="!isArray(route)"
          class="item"
          exact
          :to="route.path">
          <div class="icons">
            <span class="material-icons">
              {{ isArray(route) ? 'arrow_drop_down' : '' }}
            </span>
            <span class="material-icons">
              {{ route.icon }}
            </span>
          </div>
          <span>
            {{ route.title }}
          </span>
        </router-link>
        <template v-else>
          <div
            class="item"
            :class="{'active': route.active}"
            @click="route.active = !route.active">
            <div class="icons">
              <span class="material-icons arrow">
                {{ isArray(route) ? 'arrow_drop_down' : '' }}
              </span>
              <span class="material-icons">
                {{ route.icon }}
              </span>
            </div>
            <span>
              {{ route.title }}
            </span>
          </div>
          <div class="dropdown-container">
            <transition name="dropdown">
              <div
                v-if="route.active"
                class="dropdown">
                <div class="items">
                  <router-link
                    v-for="(subroute, $index) in getArray(route)"
                    :key="$index"
                    :to="subroute.path"
                    class="item">
                    <div class="icons">
                      <span class="material-icons"></span>
                      <span class="subroute material-icons">{{ subroute.icon }}</span>
                    </div>
                    <span>
                      {{ subroute.title }}
                    </span>
                  </router-link>
                </div>
              </div>
            </transition>
          </div>
        </template>
      </div>
    </nav>
    <div class="add-playlist pointer text-center text--primary flex-center">
      <!-- <span class="material-icons">add_circle</span> -->
      <span class="title text--bold">
        Criar Playlist
      </span>
    </div>
    <div class="bottom">
      <div class="img">
        <img
          v-if="image"
          :src="image">
        <template v-else>
          <div class="placeholder">
            <span class="material-icons">album</span>
          </div>
        </template>
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
  { title: 'Minhas músicas', path: '/songs', icon: 'music_note' },
  { title: 'Playlists', path: '/playlists', icon: 'playlist_play', items: 'playlists' }
]

export default {
  name: 'Sidebar',
  mixins: [mixin],
  data () {
    return {
      routes: routes.map(it => {
        it.active = true
        return it
      })
    }
  },
  methods: {
    isArray (route) {
      return route.items
    },
    getArray (route) {
      if (Array.isArray(route.items)) {
        return route.items
      }
      return this[route.items]
    }
  },
  computed: {
    ...mapGetters('Player', {
      song: 'get'
    }),
    ...mapGetters('Playlist', {
      lists: 'get'
    }),
    playlists () {
      return this.lists.map(list => {
        return {
          icon: 'album',
          title: list.snippet.title,
          path: `/playlists/${list.id}`
        }
      })
    },
    image () {
      if (!this.song) {
        return null
      }
      if (!this.song.downloaded || this.song.downloaded < 0) {
        return this.song.snippet.thumbnails.medium.url
      }
      return `http://localhost:${PORT}/meta/${this.file(this.song, 'jpg')}`
    }
  }
}
</script>

<style lang="sass" scoped>
.link
  .item
    $icon: 24px
    $animation: .25s
    display: grid
    grid-gap: .5rem
    grid-template-columns: 3fr 7fr
    border-top-right-radius: 100px
    border-bottom-right-radius: 100px
    width: 95%
    font-weight: 500
    padding: .75rem 0
    font-size: 13px
    cursor: pointer
    > span
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    & + .dropdown-container
      overflow: hidden
    > .icons
      display: grid
      grid-template-columns: 1fr 1fr
      .subroute
        font-size: 1rem
      .arrow
        transition: transform $animation ease-in-out
    &:not(.active)
      .arrow
        transform: rotateZ(-90deg) translateX(15%)
    &:hover, &:focus
      background: $neutral
    &.active, &:active
      font-weight: 600
      background: $neutral
      &[href]
        color: $primary
        background: $primary-light
    > *
      align-self: center
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
    min-height: $sidebar-size
    .img
      width: 100%
      height: $sidebar-size
      background: $neutral
      .placeholder
        display: flex
        justify-content: center
        align-items: center
        span
          color: #888
          font-size: calc(#{$sidebar-size} - 2rem)
      .placeholder, img
        height: 100%
      img
        object-fit: cover
  .add-playlist
    padding: 1rem .5rem
    .title
      text-transform: uppercase
      margin-left: .5rem
  .logo
    min-height: 88px
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
