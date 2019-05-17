<template>
  <section class="search">
    <grid-component
      v-if="playlists.length"
      title="Playlists"
      :extended="true"
      :columns="3"
      :list="playlists" />
    <grid-component
      v-if="videos.length"
      title="Músicas"
      :columns="5"
      :list="videos" />
    <!-- <list-component
      :list="list" /> -->
    <!-- <div class="text-center more">
      <button
        class="btn btn--primary--flat"
        @click="nextPage()"
        v-if="search.nextPage">
        CARREGAR MAIS
      </button>
    </div> -->
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { search } from '../../services/youtube'
import ListComponent from '@/components/commons/List'
import GridComponent from '@/components/commons/Mosaic'

export default {
  name: 'Search',
  components: {
    ListComponent,
    GridComponent
  },
  watch: {
    '$route.query.q': 'doSearch'
  },
  data () {
    return {
      videos: [],
      playlists: []
    }
  },
  methods: {
    ...mapActions('Search', ['nextPage', 'do']),
    doSearch () {
      const q = this.$route.query.q
      search({ q })
        .then(this.complete)
    },
    complete ({ videos = [], playlists = [] }) {
      this.videos = videos.items.map(video => ({
        ...video,
        id: video.id.videoId
      }))
      this.playlists = playlists.items.map(playlist => ({
        ...playlist,
        id: playlist.id.playlistId
      }))
    }
  },
  computed: {
  },
  mounted () {
    this.doSearch()
  }
}
</script>

<style lang="sass" scoped>
.search
  flex: 1
  overflow: auto
  padding: 1rem
  & /deep/ .grid
  .more
    margin-top: 2rem
</style>
