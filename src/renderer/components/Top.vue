<template>
<section class="top">
  <div class="no-select">
    <span @click="$router.go(-1)" class="material-icons pointer">chevron_left</span>
    <span @click="$router.go(1)" class="material-icons pointer">chevron_right</span>
  </div>
  <div
    :class="{'active': active}"
    class="input no-select">
    <span
      @click="search(text)"
      class="material-icons pointer">search</span>
    <input
      placeholder="Pesquisar música"
      type="text"
      v-model="text"
      @focus="active = true"
      @blur="active = false"
      @keypress.enter="search(text)">
    <transition name="fade">
      <span
        class="material-icons pointer"
        v-if="text"
        @click="reset()">close</span>
    </transition>
  </div>
  <div class="logout no-select">
    <span
      @click="logout"
      class="material-icons pointer ghost">
      exit_to_app
    </span>
  </div>
</section>
</template>

<script>
import { mapActions } from 'vuex'
import { revoke } from '../services/login'

export default {
  name: 'Top',
  data () {
    return {
      text: '',
      active: false
    }
  },
  methods: {
    ...mapActions('User', ['setToken']),
    ...mapActions('Playlist', ['setPlaylists']),
    reset () {
      this.text = ''
      // this.$router.push('/')
    },
    async logout () {
      await revoke()
      this.setToken(null)
      this.setPlaylists([])
      this.$router.replace('/login')
    },
    async search (q) {
      if (!q) {
        return
      }
      const query = { q }
      this.$router.push({ path: '/search', query })
    }
  }
}
</script>

<style lang="sass" scoped>
.logout
  display: flex
  flex: 1
  justify-content: flex-end
  padding: 1rem
  > *
    font-size: 2rem
.top
  display: flex
  align-items: center
  min-height: 75px
.input
  margin: .5rem 0
  width: 65%
  display: flex
  align-items: center
  transition: all .2s ease-in
  border: thin solid transparent
  &.active
    border-color: rgba(0,0,0,0.12)
    box-shadow: 0 1px 1px rgba(0,0,0,0.24)
  &:not(.active)
    background: $input
  .material-icons
    font-size: 1.5rem
    color: #666
    padding: .75rem
  input
    background: transparent
    font-size: 1rem
    flex: 1
    border: 0
    outline: none
</style>
