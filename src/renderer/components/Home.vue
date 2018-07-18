<template>
  <section class="root">
    <div class="container">
      <sidebar />
      <div class="middle">
        <top />
        <h1>Player daora</h1>
        <button @click="action">DOWNLOAD</button>
      </div>
    </div>
    <bottom />
  </section>
</template>

<script>
import { download } from '@/services/player'
import Bottom from './Bottom.vue'
import Sidebar from './Sidebar.vue'
import Top from './Top.vue'

export default {
  name: 'Home',
  components: {
    Bottom,
    Sidebar,
    Top
  },
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
.root
  flex: 1
  display: flex
  flex-direction: column
  background: $dark
  color: $white
.container
  flex: 1
  display: grid
  grid-template-areas: 'a a'
  grid-auto-columns: min-content auto
</style>

