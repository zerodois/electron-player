<template>
  <section>
    <h1>Player daora</h1>
    <button @click="action">DOWNLOAD</button>
  </section>
</template>

<script>
import { download } from '@/services/player'

export default {
  name: 'Home',
  methods: {
    action () {
      download('https://www.youtube.com/watch?v=Fm5iP0S1z9w')
        .then(console.log)
        .catch(console.error)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>

