<template>
<section>
  <header-list
    v-if="playlist"
    type="Playlist"
    :item="playlist" />
  <template v-if="playlist">
    <div class="list">
      <div class="action-bar" v-if="!loading || playlist.videos.length">
        <div class="search"></div>
        <template v-if="loading">
          <svg class="spinner" width="1.3rem" height="1rem" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
            <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
          </svg>
        </template>
        <small style="margin-left: .5rem">Baixar playlist</small>
        <div class="right">
          <div
            :class="{'active': playlist.download}"
            @click="doDownload()"
            class="toggler toggler--primary">
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <list
      :order="playlist.order"
      @sort="sort"
      :list="playlist.videos"
      :fields="fields"
      v-if="!loading || playlist.videos.length"/>
    <div class="loading-content" v-else>
      <svg class="spinner" width="1.3rem" height="1.3rem" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </template>
</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { playlistItems, playlists } from '@/services/youtube'
import moment from 'moment'
import 'moment/locale/pt-br'
import mixin from '@/mixins/download'
import HeaderList from '@/components/commons/HeaderList'
import List from '@/components/commons/List'
moment.locale('pt-br')

export default {
  name: 'Playlist',
  components: {
    List,
    HeaderList
  },
  mixins: [mixin],
  watch: {
    '$route.params.id': 'load'
  },
  data () {
    return {
      loading: true,
      remote: null,
      fields: [
        {
          title: 'Titulo',
          key: 'snippet.title',
          sortable: true,
          eval: item => item.snippet.title.toLowerCase()
        },
        {
          title: 'Adicionado em',
          value: item => moment(item.snippet.publishedAt).calendar(),
          sortable: true,
          eval: item => moment(item.snippet.publishedAt).unix()
        }
      ]
    }
  },
  methods: {
    ...mapActions('List', ['setList']),
    ...mapActions('Playlist', ['updateList', 'updateItem']),
    async request () {
      let data = await playlistItems({
        playlistId: this.$route.params.id,
        part: 'snippet,id,contentDetails'
      })
      let arr = data
        .items
        .filter(it => it.snippet.title !== 'Private video')
        .map(it => {
          it.id = { videoId: it.contentDetails.videoId, id: it.id }
          return it
        })
      this.updateList({ ...this.playlist, videos: arr })
      if (this.playlist === this.remote) {
        this.remote.videos = arr
      }
      return arr
    },
    sort (column) {
      const playlist = { ...this.playlist }
      let asc = true
      if (playlist.order && playlist.order.type === column.title) {
        asc = !playlist.order.asc
      }
      const videos = this.doSort(this.playlist.videos.slice(), column, asc)
      playlist.order = { type: column.title, asc }
      this.updateList({ ...playlist, videos })
    },
    doSort (array, column, asc) {
      array.sort((a, b) => {
        const x = column.eval(a)
        const y = column.eval(b)
        return x < y ? (-1 + (2 * asc)) : x > y ? (1 - (2 * asc)) : 0
      })
      return array
    },
    doDownload () {
      this.updateList({
        ...this.playlist,
        download: !this.playlist.download,
        videos: this.playlist.videos.map(v => {
          return { ...v, downloaded: v.downloaded > 0 ? 1 : (this.playlist.download ? 0 : -2) }
        })
      })
      this.downloadArray(this.playlist.videos, this.update, !this.playlist.download)
    },
    update (item, index) {
      this.updateItem({ item, index, id: this.playlist.id })
    },
    async load () {
      try {
        let param = this.$route.params.id
        if (!this.playlist) {
          const playlist = await playlists({ id: param })
          if (!playlist.items.length) throw new Error('Playlist not found!')
          this.remote = {
            ...playlist.items[0],
            videos: []
          }
          return this.load()
        }
        this.setList(this.playlist.videos || [])
        this.loading = true
        let data = await this.request()
        if (param !== this.$route.params.id) {
          return
        }
        this.loading = false
        if (this.order) {
          this.setList(this.doSort(data, this.order, this.playlist.order.asc))
          return
        }
        this.setList(data)
      } catch (err) {
        console.error(err)
        return this.$snack.danger({ text: 'Erro ao carregar playlist', action: 'Fechar' })
      }
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
      return this
        .playlists
        .find(it => it.id === this.$route.params.id) || this.remote
    },
    order () {
      if (!this.playlist.order) {
        return null
      }
      return this.fields.find((field) => field.title === this.playlist.order.type)
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
  margin-left: 2rem
.loading-content
  padding-top: 10vh
  text-align: center
</style>
