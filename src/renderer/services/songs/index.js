import { ipcRenderer } from 'electron'

export const get = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('songs:get')
    ipcRenderer.on('songs:get:response', (_, data) => resolve(data))
    ipcRenderer.on('songs:get:error', (_, err) => reject(err))
  })
}
