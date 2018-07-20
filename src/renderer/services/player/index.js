import { ipcRenderer } from 'electron'

export const download = item => {
  let url = `https://www.youtube.com/watch?v=${item.id.videoId}`
  return new Promise((resolve, reject) => {
    ipcRenderer.send('download:do', { ...item, url })
    ipcRenderer.on('download:do:response', _ => resolve())
    ipcRenderer.on('download:do:error', err => reject(err))
  })
}
