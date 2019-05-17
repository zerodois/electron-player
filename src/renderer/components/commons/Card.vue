<template>
  <div class="flex flex-column card" :class="{'card--extended': extended}">
    <div class="cover">
      <img
        :src="imageCover('default', item)"
        :alt="`Cover do vídeo ${item.snippet.title}`" />
      <div class="hover flex-center">
        <span @click="$emit('play', item)" class="material-icons pointer">play_arrow</span>
      </div>
    </div>
    <div class="card__content">
      <div class="title" :class="{'ellipsis': ellipsis}">{{ item.snippet.title }}</div>
      <small>{{ item.snippet.channelTitle }}</small>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
export default {
  name: 'Card',
  mixins: [mixin],
  props: {
    item: Object,
    ellipsis: Boolean,
    extended: Boolean,
    description: Boolean
  }
}
</script>

<style lang="sass" scoped>
.card
  &--extended
    // box-shadow: 0 0 10px 0 #999
    // background: tomato
    border-radius: 4px
    padding-right: .5rem
    display: grid
    grid-template-columns: 50% 50%
    grid-column-gap: .5rem
.cover
  overflow: hidden
  position: relative
  img
    display: block
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
</style>

