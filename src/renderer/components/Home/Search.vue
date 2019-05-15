<template>
  <section class="search">
    <list-component
      :fields="fields"
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
import moment from 'moment'
import ListComponent from '@/components/commons/List'

export default {
  name: 'Search',
  components: {
    ListComponent
  },
  data () {
    return {
      fields: [
        {
          title: 'Titulo',
          key: 'snippet.title'
        },
        {
          title: 'Canal',
          value: item => {
            const min = item.snippet.channelTitle.substr(0, 15)
            if (min !== item.snippet.channelTitle) {
              return min + '...'
            }
            return min
          }
        },
        {
          title: 'Duração',
          value: item => {
            const dur = moment.duration(item.contentDetails.duration)
            const min = dur.minutes().toString().padStart(2, '0')
            const sec = dur.seconds().toString().padStart(2, '0')
            return `${min}:${sec}`
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions('Search', ['nextPage'])
  },
  computed: {
    ...mapGetters('List', {
      list: 'get'
    }),
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
