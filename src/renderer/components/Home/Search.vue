<template>
  <section class="search">
    <h1>Busca por: {{ search.q }}</h1>
    <list-component />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import ListComponent from '@/components/commons/List'

export default {
  name: 'Search',
  components: {
    ListComponent
  },
  computed: {
    ...mapGetters('Search', {
      search: 'get'
    })
  }
}
</script>

<style lang="sass" scoped>
.search
  flex: 1
  overflow: auto
</style>
