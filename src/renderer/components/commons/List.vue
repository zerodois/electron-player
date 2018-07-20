<template>
  <table class="list">
    <tbody>
      <tr
        v-for="(item, $index) in list"
        :key="$index"
        class="list__item no-select"
        :class="{'active': selected === item}"
        @dblclick="action(item, $index)"
        @click="selected = item">
        <td>
          <span
            v-if="item.downloaded !== -1"
            @click="action(item, $index)"
            :class="{'sm': item.downloaded !== true}"
            class="material-icons play pointer">{{ getIcon(item) }}</span>
          <template v-else>
            <svg class="spinner" width="1.3rem" height="1.3rem" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </template>
          <!-- <button >Executar</button> -->
        </td>
        <td class="default">
          {{ item.snippet.title }}
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
  data () {
    return {
      selected: null
    }
  },
  methods: {
    ...mapActions('List', ['setItem']),
    action (item, index) {
      if (item.downloaded === -1) {
        return
      }
      if (item.downloaded) {
        return this.play(item)
      }
      this.download(item, index)
    },
    async download (item, index) {
      this.setItem({ index, item: this.getItem(item, { downloaded: -1 }) })
      let [err] = await to(download(item))
      let downloaded = true
      if (err) {
        downloaded = false
        console.error(err)
      }
      this.setItem({ index, item: this.getItem(item, { downloaded }) })
    },
    getIcon (item) {
      if (item.downloaded) {
        return 'play_circle_outline'
      }
      return 'arrow_downward'
    },
    getItem (item, rewrite) {
      return { ...item, ...rewrite }
    },
    play (item) {
      EventEmitter.$emit('song:play', item)
    }
  },
  computed: {
    ...mapGetters('List', {
      list: 'get'
    })
  }
}
</script>

<style lang="sass" scoped>
.list
  $play: 2rem
  width: 65%
  border-collapse: collapse
  .material-icons.play
    font-size: $play
  &__item
    &:not(:last-child)
      border-bottom: thin solid $neutral
    span.play
      &.sm
        font-size: 1.5rem
      opacity: .3
      &:hover
        opacity: .6
        transform: scale(1.05)
    &, span.play
      transition: all .2s ease-in
    td
      padding: .5rem 0
      > *
        vertical-align: middle
    td:first-child
      padding-left: .25rem
      width: calc(#{$play} + .5rem)
    // &:not(:hover)
      // .play
      //   opacity: 0
    &:hover
      background: $neutral
    &.active
      background: $neutral-dark
</style>
