import { to } from '@/utils'
import { mapActions } from 'vuex'
import { download } from '../../services/player'

export default {
  methods: {
    ...mapActions('List', ['setItem']),
    ...mapActions('Downloads', ['setDownloads']),
    async download (item, index) {
      this.setItem({ index, item: { ...item, downloaded: -1 } })
      let [err] = await to(download(item))
      let downloaded = 1
      if (err) {
        downloaded = 0
        console.error(err)
      }
      this.setItem({ index, item: { ...item, downloaded } })
      // download(item)
    },
    downloadArray (items, action, clear = false) {
      this.setDownloads({
        items: clear ? [] : items,
        action })
    }
  }
}
