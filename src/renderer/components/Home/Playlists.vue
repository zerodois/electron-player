<template>
  <section>
    <list
      @play="redirect"
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
import { playlists } from '../../services/youtube'
import { to } from '../../utils'
import List from '@/components/commons/List'
import { mapActions } from 'vuex'
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
    async load (append = false) {
      if (!append) {
        this.setList([])
      }
      let [err, res] = await to(playlists({ pageToken: this.nextPage }))
      if (err) {
        console.error(err)
        return this.$snack.danger({
          text: 'Erro ao carregar playlists',
          button: 'tentar de novo',
          action: this.load
        })
      }
      this.nextPage = res.nextPageToken
      if (append) {
        return this.mergeList(res.items)
      }
      this.setList(res.items)
    },
    redirect ({ item }) {
      this.$router.push(`/playlists/${item.id}`)
    }
  },
  async created () {
    this.load()
  }
}
</script>

<style lang="sass" scoped>
.text-center
  margin-top: 2rem
</style>
