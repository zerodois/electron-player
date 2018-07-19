import { ipcRenderer } from 'electron'

export const download = item => {
  let url = `https://www.youtube.com/watch?v=${item.id.videoId}`
  ipcRenderer.send('download:do', { ...item, url })
  return new Promise((resolve, reject) => {
    resolve()
  })
}
