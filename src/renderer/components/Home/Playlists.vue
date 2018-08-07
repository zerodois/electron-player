<template>
  <section>
    <list
      @play="redirect"
      :list="playlists"
      :events="true"
      :fields="fields" />
    <div class="text-center">
      <button
        v-if="nextPage"
        @click="load(true)"
        class="btn btn--primary--flat">
        CARREGAR MAIS
      </button>
    </div>
  </section>
</template>

<script>
import List from '@/components/commons/List'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'Playlists',
  components: {
    List
  },
  data () {
    return {
      nextPage: null,
      fields: [
        { title: 'Titulo', key: 'snippet.title' },
        { title: 'Criado em', value: item => moment(item.snippet.publishedAt).calendar() }
      ]
    }
  },
  methods: {
    ...mapActions('List', ['setList', 'mergeList']),
    ...mapActions('Playlist', ['setPlaylists']),
    redirect ({ item }) {
      this.$router.push(`/playlists/${item.id}`)
    }
  },
  computed: {
    ...mapGetters('Playlist', {
      playlists: 'get'
    })
  }
}
</script>

<style lang="sass" scoped>
.text-center
  margin-top: 2rem
</style>
