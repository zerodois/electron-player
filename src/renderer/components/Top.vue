<template>
<section class="top">
  <input
    type="text"
    v-model="text"
    @keypress.enter="search(text)">
</section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Top',
  data () {
    return {
      text: ''
    }
  },
  methods: {
    ...mapActions('Search', ['do']),
    async search (q) {
      this.do({ q })
        .then(_ => this.$router.push('/search'))
        .catch(console.error)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
