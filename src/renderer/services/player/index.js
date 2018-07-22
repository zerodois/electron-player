// import store from '../../store'
import { ipcRenderer } from 'electron'
// this.setItem({ index, item: this.getItem(item, { downloaded: -1 }) })

// let [err] = await to(download(item))
// let downloaded = true
// if (err) {
//   downloaded = false
//   console.error(err)
// }
// this.setItem({ index, item: this.getItem(item, { downloaded }) })

export const download = (item, index) => {
  let url = `https://www.youtube.com/watch?v=${item.id.videoId}`
  return new Promise((resolve, reject) => {
    ipcRenderer.send('download:do', { ...item, url })
    ipcRenderer.on('download:do:response', _ => resolve())
    ipcRenderer.on('download:do:error', err => reject(err))
  })
}
