<template>
<section>
  <input
    type="text"
    v-model="text"
    @keypress.enter="search(text)">
</section>
</template>

<script>
export default {
  name: 'Top',
  data () {
    return {
      text: ''
    }
  },
  methods: {
    search (text) {
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
