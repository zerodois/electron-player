import { ipcRenderer } from 'electron'

export const search = q => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:get', q)
    ipcRenderer.on('youtube:get:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:get:error', (_, err) => reject(err))
  })
}
