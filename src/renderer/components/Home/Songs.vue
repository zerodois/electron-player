<template>
  <section>
    <span class="title title--main">Minhas músicas</span>
    <button class="btn btn--primary--flat">EXECUTAR</button>
    <list-component
      class="list--no-top"
      :list="list" />
  </section>
</template>

<script>
import ListComponent from '@/components/commons/List'
import { to, EventEmitter } from '@/utils'
import { get } from '@/services/songs'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Songs',
  components: {
    ListComponent
  },
  methods: {
    ...mapActions('List', ['setList']),
    async load () {
      let [err, list] = await to(get())
      if (err) {
        list = []
        console.error(err)
      }
      this.setList(list)
    },
    play (item) {
      EventEmitter.$emit('song:play', item)
    }
  },
  computed: {
    ...mapGetters('List', {
      list: 'get'
    })
  },
  created () {
    this.load()
  }
}
</script>

<style lang="sass" scoped>
.title
  margin-left: .75rem
  display: block
  font-size: 2.5rem
  margin-top: 1rem
</style>
