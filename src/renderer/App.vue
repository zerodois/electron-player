<template>
  <div id="app">
    <div class="container">
      <sidebar />
      <div class="middle">
        <top />
        <router-view></router-view>
      </div>
    </div>
    <bottom />
  </div>
</template>

<script>
import Bottom from './components/Bottom.vue'
import Sidebar from './components/Sidebar.vue'
import Top from './components/Top.vue'

export default {
  name: 'vue-player',
  components: {
    Bottom,
    Sidebar,
    Top
  }
}
</script>

<style lang="sass">
@import './sass/main.sass'
#app
  display: flex
  height: 100%
  flex-direction: column
  .container
    flex: 1
    display: grid
    grid-template-areas: 'a a'
    grid-auto-columns: min-content auto
</style>
