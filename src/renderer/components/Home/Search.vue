<template>
  <section class="search">
    <list-component />
    <div class="text-center more">
      <button
        class="btn btn--primary--flat"
        @click="nextPage()"
        v-if="search.nextPage">
        CARREGAR MAIS
      </button>
    </div>
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
  flex: 1
  overflow: auto
  .more
    margin-top: 2rem
</style>
