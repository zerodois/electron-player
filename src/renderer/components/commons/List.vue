<template>
  <ul class="list">
    <li
      v-for="(item, $index) in list"
      :key="$index">
      {{ item.snippet.title }}
      <button @click="action(item)">Baixar</button>
    </li>
  </ul>
</template>

<script>
import { download } from '../../services/player'
import { mapGetters } from 'vuex'

export default {
  name: 'List',
  methods: {
    action (item) {
      download(item)
        .then(console.log)
        .catch(console.error)
    }
  },
  computed: {
    ...mapGetters('List', {
      list: 'get'
    })
  }
}
</script>
