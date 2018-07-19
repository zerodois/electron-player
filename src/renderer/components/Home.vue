<template>
  <section class="root">
    <div class="container">
      <sidebar />
      <div class="middle">
        <top />
        <router-view />
      </div>
    </div>
    <bottom />
  </section>
</template>

<script>
import Bottom from './Bottom.vue'
import Sidebar from './Sidebar.vue'
import Top from './Top.vue'

export default {
  name: 'Home',
  components: {
    Bottom,
    Sidebar,
    Top
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
  overflow: hidden
  grid-auto-columns: min-content auto
  grid-auto-rows: 100%
.middle
  display: flex
  flex-direction: column
</style>

