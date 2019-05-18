<template>
  <Grid
    class="grid-mosaic"
    :list="list"
    :title="title"
    :ellipsis="ellipsis"
    :columns="columns"
    :onPlay="onPlay"
    :extended="true"
  >
    <h1 slot-scope="{ item }">
      <router-link :to="`/playlists/${item.id}`" class="pointer text--primary">
        ABRIR
      </router-link>
    </h1>
  </Grid>
</template>

<script>
import Grid from '@/components/commons/Mosaic'

export default {
  name: 'SearchMosaic',
  props: {
    list: Array,
    title: {
      type: String,
      default: null
    },
    ellipsis: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Number,
      default: 4
    },
    onPlay: Function
  },
  components: {
    Grid
  }
}
</script>

<style lang="sass" scoped>
</style>
