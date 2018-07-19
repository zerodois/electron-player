<template>
  <ul class="list">
    <li
      v-for="(item, $index) in list"
      :key="$index">
      {{ item.snippet.title }}
      <button @click="play(item)">Executar</button>
      <button
        v-if="!item.downloaded"
        @click="action(item)">Baixar</button>
    </li>
  </ul>
</template>

<script>
import { EventEmitter } from '@/utils'
import { download } from '../../services/player'
import { mapGetters } from 'vuex'

export default {
  name: 'List',
  methods: {
    action (item) {
      download(item)
        .then(console.log)
        .catch(console.error)
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
