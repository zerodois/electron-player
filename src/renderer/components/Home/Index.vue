<template>
  <section class="scroll">
    <header-list
      :square="false"
      v-if="videos.length"
      type="Destaque"
      :item="videos[0]"
      @play="play(videos[0])">
      <span class="view-count">
        <span class="views">
          {{ views }}
        </span>
        Visualizações
      </span>
    </header-list>
    <div>
      <div class="trends">Outros Destaques</div>
      <list-component
        @play="play"
        :columns="4"
        :list="others" />
    </div>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Mosaic from '@/components/commons/Mosaic'
import HeaderList from '@/components/commons/HeaderList'
import { videos } from '@/services/youtube'
import { to, EventEmitter } from '@/utils'

export default {
  name: 'HomePage',
  components: {
    ListComponent: Mosaic,
    HeaderList
  },
  methods: {
    ...mapActions('Trends', ['setList']),
    play (item) {
      EventEmitter.$emit('song:play', item)
    },
    async load () {
      if (this.videos.length) {
        return
      }
      const q = {
        part: 'statistics,snippet,id',
        chart: 'mostPopular',
        regionCode: 'BR', // Região Brasil
        videoCategoryId: '10', // Categoria Música
        token: this.token,
        maxResults: 17
      }
      const [err, results] = await to(videos(q))
      if (err) {
        console.error(err)
        this.$snack.danger({ text: 'Erro ao buscar músicas em alta' })
        return
      }
      this.setList(results.items)
    }
  },
  computed: {
    ...mapGetters('User', {
      token: 'getToken'
    }),
    ...mapGetters('Trends', { videos: 'get' }),
    others () {
      return this.videos.slice(1, this.videos.length)
    },
    views () {
      const arr = this.videos[0].statistics.viewCount.toString().split('')
      let res = ''
      let count = 1
      for (let ix = arr.length - 1; ix >= 0; ix--) {
        res = arr[ix] + res
        if (!(count % 3) && ix) {
          res = '.' + res
        }
        count += 1
      }
      return res
    }
  },
  created () {
    this.load()
  }
}
</script>

<style lang="sass" scoped>
.scroll
  padding: 0 2rem
  .view-count
    margin-top: .5rem
    .views
      color: $primary
  .trends
    font-weight: 500
    text-transform: uppercase
    margin: 2rem 0 1rem
  & /deep/ header
    .cover
      width: 40%
      img
        width: 100%
        height: auto
        border-radius: 4px
    .title
      font-size: 2rem
</style>
