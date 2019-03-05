<template>
  <header>
    <section class="cover" :class="{'square': square}">
      <img :src="item.snippet.thumbnails.high.url" alt="Playlist Thumbnail">
    </section>
    <div class="content">
      <span class="type">{{ type }}</span>
      <span class="title title--main">{{ item.snippet.title }}</span>
      <small>Criada por <span class="text--primary">{{ item.snippet.channelTitle }}</span></small>
      <slot />
      <div>
        <button @click="$emit('play')" class="btn btn--primary--flat">EXECUTAR</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderList',
  props: {
    item: Object,
    type: String,
    square: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="sass" scoped>
header
  margin: 2rem 0 0 0
  display: flex
  $photo: 230px
  .type
    text-transform: uppercase
  .btn
    padding-left: 0
  .content
    min-width: 0
    flex: 1
    display: flex
    flex-direction: column
    justify-content: center
    padding: 1rem
  .cover
    img
      border-radius: 4px
      box-shadow: 0 0 10px 0 #ccc
      height: $photo
      object-fit: cover
    &.square
      img
        width: $photo
</style>
