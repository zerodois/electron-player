<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'vue-player'
}
</script>

<style lang="sass">
@import './sass/main.sass'
#app
  display: flex
  height: 100%
  flex-direction: column
  .list
    width: 85%
</style>
