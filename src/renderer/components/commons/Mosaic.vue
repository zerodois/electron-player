<template>
  <section
    :style="`grid-template-columns: repeat(${columns}, 1fr)`"
    class="grid">
    <div
      v-for="item in list"
      :key="item.id"
      class="grid--item flex flex-column">
      <div class="cover">
        <img
          :src="imageCover('default', item)"
          :alt="`Cover do vídeo ${item.snippet.title}`" />
        <div class="hover flex-center">
          <span @click="$emit('play', item)" class="material-icons pointer">play_arrow</span>
        </div>
      </div>
      <div class="title" :class="{'ellipsis': ellipsis}">{{ item.snippet.title }}</div>
      <small>{{ item.snippet.channelTitle }}</small>
      <slot></slot>
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
    },
    onPlay: Function
  }
}
</script>

<style lang="sass" scoped>
.grid
  grid-gap: 1.5rem .5rem
  .cover
    overflow: hidden
    position: relative
    img
      box-shadow: 0 0 5px 1px rgba(0, 0, 0, .3)
      border-radius: 4px
    &:not(:hover) .hover
      opacity: 0
    .hover
      transition: opacity .25s ease-in
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      span
        box-shadow: 0 0 5px 0 #666
        padding: .5rem
        background: white
        border-radius: 50%
        color: #333
        font-size: 2.75rem
    img
      width: 100%
      object-fit: cover
  .title
    margin-top: .5rem
  &--item
    min-width: 0
</style>
