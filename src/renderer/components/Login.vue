<template>
  <section class="login">
    <div class="cover">
      <img src="/static/images/background.jpg" alt="background login">
    </div>
    <img src="/static/images/logo-white.svg" class="logo" alt="Player logo">
    <span class="logo-title text--white">Quark.</span>
    <span
      class="text--medium text--white title pointer"
      @click="popup"
      v-if="url">
      ENTRAR
    </span>
  </section>
</template>

<script>
import { mapActions } from 'vuex'
import { getUrl, auth, decode } from '../services/login'
import { to } from '@/utils'

export default {
  name: 'Login',
  data () {
    return {
      url: '',
      error: false
    }
  },
  methods: {
    ...mapActions('User', ['setToken']),
    popup () {
      auth(this.url)
        .onSuccess(this.success)
        .onError(_ => alert('DEU BOSTA (SO QUE BOM)'))
    },
    async success (code) {
      let [err, token] = await to(decode(code))
      if (err) {
        return console.error(`ERRO NO STORE`, err)
      }
      this.setToken(token)
      this.$router.replace('/')
    }
  },
  async created () {
    let [err, url] = await to(getUrl())
    if (err) {
      this.error = err
      return
    }
    this.url = url
  }
}
</script>

<style lang="sass" scoped>
.cover
  z-index: -1
  &, &::after
    display: block
    position: fixed
    top: 0
    left: 0
  &, & > img, &::after
    width: 100%
    height: 100%
  &::after
    content: ''
    background: rgba(255, 0, 0, .7)
  > img
    object-fit: cover
.login
  display: flex
  background-color: transparent
  flex-direction: column
  align-items: center
  justify-content: center
  flex: 1
  .logo-title
    font-family: $logo-font
    font-weight: 300
    font-size: 3.5rem
    margin-bottom: 3rem
  .title
    font-size: 1.75rem
  .btn
    $p: 1.25rem
    padding-left: $p
    padding-right: $p
    svg
      margin-right: .5rem
  > img.logo
    width: 15vw
</style>
