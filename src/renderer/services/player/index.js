import { ipcRenderer } from 'electron'

export const download = url => {
  ipcRenderer.send('download:do', url)
  return new Promise((resolve, reject) => {
    resolve()
  })
}
