<template>
  <section class="login">
    <img src="/static/images/logo.svg" alt="Player logo">
    <button
      class="btn btn--rounded btn--primary--outlined"
      @click="popup"
      v-if="url">
      <font-awesome-icon
        size="2x"
        :icon="['fab', 'google']" />
      Entrar com a conta Google
    </button>
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
.login
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  flex: 1
  .btn
    $p: 1.25rem
    padding-left: $p
    padding-right: $p
    svg
      margin-right: .5rem
  > img
    width: 15vw
    margin-bottom: 1rem
</style>
