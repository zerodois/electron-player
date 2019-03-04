<template>
  <section class="scroll">
    <h1>
      Navegando
    </h1>
    <list-component
      :columns="4"
      :list="videos" />
  </section>
</template>

<script>
import Mosaic from '@/components/commons/Mosaic'
import { mapGetters } from 'vuex'
import { videos } from '@/services/youtube'
import { to } from '@/utils'

export default {
  name: 'HomePage',
  components: {
    ListComponent: Mosaic
  },
  data () {
    return {
      videos: []
    }
  },
  methods: {
    async load () {
      const q = {
        chart: 'mostPopular',
        regionCode: 'BR', // Região Brasil
        videoCategoryId: '10', // Categoria Música
        token: this.token,
        maxResults: 15
      }
      const [err, results] = await to(videos(q))
      if (err) {
        console.error(err)
        this.$snack.danger({ text: 'Erro ao buscar músicas em alta' })
        return
      }
      this.videos = results.items
    }
  },
  computed: {
    ...mapGetters('User', {
      token: 'getToken'
    })
  },
  created () {
    this.load()
  }
}
</script>

<style lang="sass" scoped>
.scroll
  padding: 0 2rem
</style>
