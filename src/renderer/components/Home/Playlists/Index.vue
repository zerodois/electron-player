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
    <list
      :list="list"
      v-if="!loading"/>
  </template>
</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { playlistItems } from '@/services/youtube'
import { to } from '@/utils'
import List from '@/components/commons/List'

export default {
  name: 'Playlist',
  components: {
    List
  },
  data () {
    return {
      loading: true
    }
  },
  methods: {
    ...mapActions('List', ['setList'])
  },
  computed: {
    ...mapGetters('Playlist', {
      playlists: 'get'
    }),
    ...mapGetters('List', {
      list: 'get'
    }),
    playlist () {
      return this.playlists.find(it => it.id === this.$route.params.id)
    }
  },
  async created () {
    let [err, data] = await to(playlistItems({
      playlistId: this.$route.params.id,
      part: 'snippet,id,contentDetails'
    }))
    if (err) {
      console.error(err)
      return this.$snack.danger({ text: 'Erro ao carregar playlist', action: 'Fechar' })
    }
    this.setList(data.items.map(it => {
      it.id = { videoId: it.contentDetails.videoId }
      return it
    }))
    this.loading = false
  }
}
</script>

<style lang="sass" scoped>
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
