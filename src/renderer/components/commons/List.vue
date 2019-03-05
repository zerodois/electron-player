<template>
  <section>
    <context-menu ref="menu">
      <template v-if="context">
        <li>
          <span class="material-icons">playlist_add</span>
          <span>
            Adicionar à Playlist
          </span>
          <span class="material-icons">chevron_right</span>
          <ul class="ctx-menu open">
            <li
              v-for="(playlist, $index) in playlists"
              :key="$index"
              @click="addToPlaylist(playlist, context.item)">
              <span class="material-icons">album</span>
              <span>{{ playlist.snippet.title }}</span>
            </li>
          </ul>
        </li>
        <li
          @click="download(context.item, context.index)"
          v-if="!context.item.downloaded">
          <span class="material-icons">arrow_downward</span>
          <span>
            Salvar no computador
          </span>
          <span></span>
        </li>
        <li
          @click="remove(context.item)"
          v-if="playlist">
          <span class="material-icons">delete</span>
          <span>
            Remover desta playlist
          </span>
          <span></span>
        </li>
      </template>
    </context-menu>
    <table class="list">
      <thead>
        <tr class="list__item">
          <td class="min"></td>
          <td class="min"></td>
          <td
            class="list__item__column"
            v-for="(field, $index) in fields"
            :key="$index">
            <span
              @click="field.sortable ? $emit('sort', field) : null"
              class="default no-select"
              :class="{'ghost': field.sortable}">
              {{ field.title }}
            </span>
            <span
              v-if="sort.type === field.title"
              class="material-icons arrow text--primary">
              {{ sort.asc ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
            </span>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, $index) in list"
          :key="item.id.videoId"
          tabindex="0"
          @blur="selected = null"
          @contextmenu.prevent="open({ item, index: $index })"
          class="list__item no-select"
          :class="[{'selected': selected === item}, {'active': song && song.id.videoId === item.id.videoId}]"
          @dblclick="action(item, $index)"
          @click="selected = item">
          <td class="min text-end">
            <span
              @click="action(item, $index)"
              class="material-icons icon play pointer">{{ getIcon(item) }}</span>
            <!-- <button >Executar</button> -->
          </td>
          <td class="min">
            <span
              v-if="item.downloaded >= 0"
              @click="download(item, $index)"
              :class="{'downloaded': item.downloaded}"
              class="material-icons icon down pointer">arrow_downward</span>
            <span
              v-else-if="item.downloaded === -2"
              class="material-icons icon down pointer">hourglass_empty</span>
            <template v-else>
              <svg class="spinner" width="1.3rem" height="1.3rem" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
              </svg>
            </template>
            <!-- <button >Executar</button> -->
          </td>
          <td
            v-for="(field, $index) in fields"
            :key="$index"
            :class="{'last': $index === fields.length - 1}"
            class="default">
            {{ evaluate(item, field) }}
          </td>
          <!-- <td>
            <button
              v-if="!item.downloaded"
              @click="action(item)">Baixar</button>
          </td> -->
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { EventEmitter } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import { put, remove } from '../../services/youtube'
import ContextMenu from 'vue-context-menu'
import mixin from '@/mixins/download'

export default {
  name: 'List',
  props: {
    list: Array,
    order: Object,
    fields: {
      type: Array,
      default: _ => [
        { title: 'Titulo', key: 'snippet.title' },
        { title: 'Canal', key: 'snippet.channelTitle' }
      ]
    },
    events: Boolean
  },
  mixins: [mixin],
  components: {
    ContextMenu
  },
  data () {
    return {
      selected: null,
      context: null,
      playlist: this.$route.name === 'Detalhes Playlist' && this.$route.params.id
    }
  },
  methods: {
    ...mapActions('List', ['setItem', 'setList']),
    ...mapActions('Playlist', ['addVideo', 'removeVideo']),
    success (text) {
      return () => this.$snack.show({ text, button: 'fechar' })
    },
    error ({ text, action }) {
      return err => {
        console.error(err)
        this.$snack.danger({ text, button: 'tentar novamente', action })
      }
    },
    addToPlaylist (playlist, video) {
      let videoId = video.id.videoId
      put(playlist.id, videoId)
        .then(json => {
          let nVideo = { ...video, id: { videoId, id: json.id } }
          this.addVideo({ playlist, video: nVideo })
        })
        .then(this.success('Música adicionada à playlist'))
        .catch(this.error({ text: 'Erro ao adicionar playlist', action: () => this.addToPlaylist(playlist, video) }))
        .then(() => (this.context = null))
    },
    remove (video) {
      let videoId = video.id.videoId
      remove(video.id.id)
        .then(() => this.removeVideo({ playlist: this.active, videoId }))
        .then(this.success('Música removida desta playlist'))
        .catch(this.error({ text: 'Erro ao remover da playlist', action: () => this.remove(video) }))
        .then(() => (this.context = null))
    },
    open (item) {
      this.context = item
      this.selected = item
      this.$refs.menu.open()
    },
    evaluate (item, field) {
      if (typeof field.value === 'function') {
        return field.value(item)
      }
      if (!field.key) {
        return ''
      }
      return field.key.split('.').reduce((p, c) => p[c], item)
    },
    action (item, index) {
      if (this.events) {
        return this.$emit('play', { item, index })
      }
      if (item.downloaded === -1) {
        return
      }
      return this.play(item)
    },
    getIcon (item) {
      if (this.isActive(item)) {
        return 'volume_up'
      }
      if (item.downloaded) {
        return 'play_circle_outline'
      }
      return 'play_circle_outline'
    },
    getItem (item, rewrite) {
      return { ...item, ...rewrite }
    },
    isActive (item) {
      return this.running && this.song && item.id.videoId === this.song.id.videoId
    },
    play (item) {
      EventEmitter.$emit('song:play', item)
    }
  },
  computed: {
    ...mapGetters('Player', {
      song: 'get',
      running: 'getRunning'
    }),
    ...mapGetters('Playlist', {
      playlists: 'get'
    }),
    sort () {
      return this.order || {}
    },
    active () {
      if (!this.playlist) {
        return null
      }
      return this.playlists.find(p => p.id === this.playlist)
    }
  }
}
</script>

<style lang="sass" scoped>
.list
  $play: 1.5rem
  $down: 1.25rem
  margin-top: 2rem
  &--no-top
    margin-top: .5rem
  border-collapse: collapse
  .last
    max-width: 10rem
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden
  .material-icons.icon
    font-size: $play
    &.down
      font-size: $down
      &.downloaded
        font-size: 1rem
        border-radius: 50%
        padding: .15rem
        background: $primary
        color: white
  thead
    .list__item
      font-weight: 500
      border-bottom: thin solid #ddd
  > *:not(thead)
    .list__item
      &:hover
        background: $neutral
      &.selected
        background: $neutral-dark

  &__item
    outline: none
    .arrow
      font-size: 1.25rem
    &:not(:last-child)
      border-bottom: thin solid $neutral
    &:not(.active)
      span.icon:not(.downloaded)
        opacity: .3
        &:hover
          opacity: .6
          transform: scale(1.05)
    &, span.icon
      transition: all .2s ease-in
    td
      padding: .5rem 0
      &:last-child
        min-width: 8rem
        padding-right: .5rem
      > *
        vertical-align: middle
    td.min
      padding-left: .25rem
      width: calc(#{$play} + .5rem)
    &:not(:hover):not(.active):not(.downloaded)
      .play
        opacity: 0
    &.active
      font-weight: 500
      color: $primary
</style>
