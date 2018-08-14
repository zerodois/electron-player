<template>
<section>
  <template v-if="playlist">
    <header>
      <section class="cover">
        <img :src="playlist.snippet.thumbnails.high.url" alt="Playlist Thumbnail">
      </section>
      <div class="content">
        <span>PLAYLIST</span>
        <span class="title title--main">{{ playlist.snippet.title }}</span>
        <small>Criada por <span class="text--primary">{{ playlist.snippet.channelTitle }}</span></small>
        <div>
          <button class="btn btn--primary--flat">EXECUTAR</button>
        </div>
      </div>
    </header>
    <div class="action-bar">
      <div class="search"></div>
      <small>Baixar playlist</small>
      <div class="right">
        <div
          :class="{'active': playlist.download}"
          @click="doDownload()"
          class="toggler toggler--primary">
          <span></span>
        </div>
      </div>
    </div>
    <list
      :list="playlist.videos"
      v-if="!loading"/>
  </template>
</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { playlistItems } from '@/services/youtube'
import { to } from '@/utils'
import mixin from '@/mixins/download'
import List from '@/components/commons/List'

export default {
  name: 'Playlist',
  components: {
    List
  },
  mixins: [mixin],
  watch: {
    '$route.params.id': 'load'
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    ...mapActions('List', ['setList']),
    ...mapActions('Playlist', ['updateList', 'updateItem']),
    async request () {
      if (this.playlist.videos) {
        return this.playlist.videos
      }
      let data = await playlistItems({
        playlistId: this.$route.params.id,
        part: 'snippet,id,contentDetails'
      })
      let arr = data.items.map(it => {
        it.id = { videoId: it.contentDetails.videoId }
        return it
      })
      this.updateList({ ...this.playlist, videos: arr })
      return arr
    },
    doDownload () {
      this.updateList({
        ...this.playlist,
        download: !this.playlist.download,
        videos: this.playlist.videos.map(v => {
          return { ...v, downloaded: v.downloaded > 0 ? 1 : (this.playlist.download ? 0 : -2) }
        })
      })
      if (this.playlist.download) {
        this.downloadArray(this.playlist.videos, this.update)
      }
    },
    update (item, index) {
      this.updateItem({ item, index, id: this.playlist.id })
    },
    async load () {
      this.loading = true
      let [err, data] = await to(this.request())
      this.loading = false
      if (err) {
        console.error(err)
        return this.$snack.danger({ text: 'Erro ao carregar playlist', action: 'Fechar' })
      }
      this.setList(data)
    }
  },
  computed: {
    ...mapGetters('Playlist', {
      playlists: 'get'
    }),
    ...mapGetters('List', {
      list: 'get'
    }),
    playlist () {
      return this.playlists.find(it => it.id === this.$route.params.id) || {}
    }
  },
  async created () {
    this.load()
  }
}
</script>

<style lang="sass" scoped>
.action-bar
  display: flex
  padding: .5rem 1rem
  align-items: center
  .search
    flex: 1
  .right
    margin: 0 1rem
    width: 2rem
header
  margin: 2rem 0 0 0
  display: flex
  $photo: 230px
  .btn
    padding-left: 0
  .content
    flex: 1
    display: flex
    flex-direction: column
    justify-content: center
    padding: 1rem
  .cover
    img
      box-shadow: 0 0 10px 0 #ccc
      height: $photo
      width: $photo
      object-fit: cover
</style>
