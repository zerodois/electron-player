<template>
  <section class="search">
    <list-component
      :list="list" />
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
  watch: {
    '$route.query.q': 'doSearch'
  },
  methods: {
    ...mapActions('Search', ['nextPage', 'do']),
    doSearch () {
      const q = this.$route.query.q
      this.do({ q })
    }
  },
  computed: {
    ...mapGetters('List', {
      list: 'get'
    }),
    ...mapGetters('Search', {
      search: 'get'
    })
  },
  mounted () {
    this.doSearch()
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
