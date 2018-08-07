<template>
  <section class="root">
    <div class="container">
      <sidebar />
      <div class="middle">
        <top />
        <div class="scroll">
          <router-view />
        </div>
      </div>
    </div>
    <bottom />
  </section>
</template>

<script>
import Bottom from './Bottom.vue'
import Sidebar from './Sidebar.vue'
import { mapGetters, mapActions } from 'vuex'
import { playlists } from '@/services/youtube'
import { to } from '@/utils'
import Top from './Top.vue'

export default {
  name: 'Home',
  components: {
    Bottom,
    Sidebar,
    Top
  },
  computed: {
    ...mapGetters('Playlist', {
      playlists: 'get'
    })
  },
  methods: {
    ...mapActions('Playlist', ['setPlaylists']),
    async load () {
      let [err, res] = await to(playlists({ maxResults: 50, mine: true }))
      if (err) {
        console.error(err)
        return this.$snack.danger({
          text: 'Erro ao carregar playlists',
          button: 'tentar de novo',
          action: this.load
        })
      }
      this.setPlaylists(res.items)
    }
  },
  created () {
    if (this.playlists.length) {
      return
    }
    this.load()
  }
}
</script>

<style lang="sass" scoped>
.root
  flex: 1
  display: flex
  flex-direction: column
  // background: $dark
  // color: $white
.container
  flex: 1
  display: grid
  grid-template-areas: 'a a'
  overflow: hidden
  grid-auto-columns: min-content auto
  grid-auto-rows: 100%
.middle
  display: flex
  flex-direction: column
  margin-left: 1rem
.scroll
  overflow: auto
</style>

