<template>
  <section>
    <list-component />
  </section>
</template>

<script>
import ListComponent from '@/components/commons/List'
import { to, EventEmitter } from '@/utils'
import { get } from '@/services/songs'
import { mapActions } from 'vuex'

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
  created () {
    this.load()
  }
}
</script>

