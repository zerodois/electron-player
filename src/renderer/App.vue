<template>
  <div id="app">
    <router-view></router-view>
    <bottom />
  </div>
</template>

<script>
import Bottom from './components/Bottom.vue'
export default {
  name: 'vue-player',
  components: {
    Bottom
  }
}
</script>

<style lang="sass">
@import './sass/main.sass'
</style>
