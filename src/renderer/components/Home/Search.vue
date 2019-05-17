<template>
  <section class="search">
    <grid-component
      v-if="playlists.length"
      title="Playlists"
      :ellipsis="true"
      :columns="5"
      :list="playlists" />
    <grid-component
      v-if="videos.length"
      title="Músicas"
      :ellipsis="true"
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
import { mapGetters, mapActions } from 'vuex'
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
  methods: {
    ...mapActions('Search', ['nextPage', 'do']),
    doSearch () {
      const q = this.$route.query.q
      this.do({ q })
    }
  },
  computed: {
    ...mapGetters('List', {
      list: 'get'
    }),
    ...mapGetters('Search', {
      search: 'get'
    }),
    videos () {
      return this.list
        .filter(item => item.id.kind === 'youtube#video')
        .map(item => ({
          ...item,
          id: item.id.videoId
        }))
    },
    playlists () {
      return this.list.filter(item => item.id.kind === 'youtube#playlist')
    },
    channels () {
      return this.list.filter(item => item.id.kind === 'youtube#channel')
    }
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
  .more
    margin-top: 2rem
</style>
