<template>
  <section class="flex-1 flex-center not-found-container">
    <div class="text-center">
      <img :src="`static/images/cute/${icon}.svg`" alt="Ícone fofo">
      <div>Você ainda não sincronizou nenhuma música nesse dispositivo.</div>
      <router-link
        to="/"
        class="btn btn--primary--flat">
        NAVEGAR
      </router-link>
    </div>
    <!-- <span>Mas nem tudo está perdido, tente explorar </span> -->
  </section>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    const rand = Math.round(Math.random() * 99) + 1
    return {
      icon: rand
    }
  }
}
</script>

<style lang="sass" scoped>
.not-found-container
  margin-top: 4rem
img
  width: 40%
  margin: auto
  margin-bottom: 2rem
</style>
