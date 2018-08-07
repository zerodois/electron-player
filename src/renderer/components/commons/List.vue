<template>
  <table class="list">
    <thead>
      <tr class="list__item">
        <td class="min"></td>
        <td class="min"></td>
        <td
          v-for="(field, $index) in fields"
          :key="$index">{{ field.title }}</td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, $index) in list"
        :key="$index"
        tabindex="0"
        @blur="selected = null"
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
            v-if="item.downloaded !== -1"
            @click="download(item, $index)"
            :class="{'downloaded': item.downloaded}"
            class="material-icons icon down pointer">arrow_downward</span>
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
</template>

<script>
import { EventEmitter, to } from '@/utils'
import { download } from '../../services/player'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'List',
  props: {
    fields: {
      type: Array,
      default: _ => [
        { title: 'Titulo', key: 'snippet.title' },
        { title: 'Canal', key: 'snippet.channelTitle' }
      ]
    },
    events: Boolean
  },
  data () {
    return {
      selected: null
    }
  },
  methods: {
    ...mapActions('List', ['setItem']),
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
      // if (item.downloaded) {
      //   return this.play(item)
      // }
      // this.download(item, index)
    },
    async download (item, index) {
      if (this.events) {
        return this.$emit('download', { item, index })
      }
      if (item.downloaded) {
        return
      }
      this.setItem({ index, item: this.getItem(item, { downloaded: -1 }) })
      let [err] = await to(download(item))
      let downloaded = true
      if (err) {
        downloaded = false
        console.error(err)
      }
      this.setItem({ index, item: this.getItem(item, { downloaded }) })
      // download(item)
    },
    getIcon (item) {
      if (this.isActive(item)) {
        return 'volume_up'
      }
      if (item.downloaded) {
        return 'play_circle_outline'
      }
      return 'play_circle_outline'
      // return 'arrow_downward'
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
    ...mapGetters('List', {
      list: 'get'
    }),
    ...mapGetters('Player', {
      song: 'get',
      running: 'getRunning'
    })
  }
}
</script>

<style lang="sass" scoped>
.list
  $play: 1.5rem
  $down: 1.25rem
  margin-top: 2rem
  width: 85%
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
