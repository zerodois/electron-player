<template>
  <div>
    <div class="trends" v-if="title">{{ title }}</div>
    <section
      :style="`grid-template-columns: repeat(${columns}, 1fr)`"
      class="grid">
      <card
        v-for="item in list"
        :key="item.id"
        :item="item"
        :extended="extended"
        :ellipsis="ellipsis"
        @play="$emit('play', item)"
        class="grid--item flex flex-column">
        <slot></slot>
      </card>
    </section>
  </div>
</template>

<script>
import Card from './Card'
export default {
  name: 'Mosaic',
  props: {
    list: Array,
    extended: Boolean,
    title: {
      type: String,
      default: null
    },
    ellipsis: {
      type: Boolean,
      default: true
    },
    description: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Number,
      default: 4
    },
    onPlay: Function
  },
  components: {
    Card
  }
}
</script>

<style lang="sass" scoped>
.trends
  font-weight: 500
  text-transform: uppercase
  margin: 2rem 0 1rem
.grid
  grid-gap: 1.5rem .5rem
  &--item
    min-width: 0
</style>
