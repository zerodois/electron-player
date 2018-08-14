// import store from '../../store'
import { ipcRenderer } from 'electron'

export const download = (item) => {
  let url = `https://www.youtube.com/watch?v=${item.id.videoId}`
  return new Promise((resolve, reject) => {
    ipcRenderer.send('download:do', { ...item, url })
    ipcRenderer.on('download:do:response', _ => resolve(item))
    ipcRenderer.on('download:do:error', err => reject(err))
  })
}

// const fk = (item) => new Promise((resolve, reject) => setTimeout(_ => resolve(item), 5000))
export const downloadList = item => {
  if (item.downloaded > 0) {
    return item
  }
  return download(item)
}
