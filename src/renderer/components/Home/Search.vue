<template>
  <section class="search">
    <list-component />
    <button
      @click="nextPage()"
      v-if="search.nextPage">
      CARREGAR MAIS
    </button>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ListComponent from '@/components/commons/List'

export default {
  name: 'Search',
  components: {
    ListComponent
  },
  methods: {
    ...mapActions('Search', ['nextPage'])
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
  padding-top: 2rem
  flex: 1
  overflow: auto
</style>
