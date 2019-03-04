<template>
  <section
    :style="`grid-template-columns: repeat(${columns}, 1fr)`"
    class="grid">
    <div
      v-for="item in list"
      :key="item.id"
      class="grid--item flex flex-column">
      <img class="cover" :src="imageCover('default', item)" :alt="`Cover do vídeo ${item.snippet.title}`">
      <div class="title" :class="{'ellipsis': ellipsis}">{{ item.snippet.title }}</div>
      <small>{{ item.snippet.channelTitle }}</small>
    </div>
  </section>
</template>

<script>
import mixin from '@/mixins'
export default {
  name: 'Mosaic',
  mixins: [mixin],
  props: {
    list: Array,
    ellipsis: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Number,
      default: 4
    }
  }
}
</script>

<style lang="sass" scoped>
.grid
  grid-gap: 1.5rem .5rem
  .cover
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, .3)
    border-radius: 4px
  .title
    margin-top: .5rem
  &--item
    min-width: 0
</style>
