<template>
  <section class="login">
    <img src="/static/images/logo.svg" alt="Player logo">
    <button
      @click="popup"
      v-if="url">Entrar com a conta Google</button>
  </section>
</template>

<script>
import { getUrl, auth } from '../services/login'
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
    popup () {
      auth(this.url)
        .onSuccess(token => alert(`SUCESSO:\n${token}`))
        .onError(_ => alert('DEU BOSTA (SO QUE BOM)'))
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
.login
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  flex: 1
  > img
    width: 10vw
</style>
