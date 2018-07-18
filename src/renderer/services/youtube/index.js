import { ipcRenderer } from 'electron'

export const search = query => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:get')
    ipcRenderer.on('youtube:get:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:get:error', (_, err) => reject(err))
  })
}
