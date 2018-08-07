import { ipcRenderer } from 'electron'
import store from '@/store'

export const search = q => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:get', q)
    ipcRenderer.on('youtube:get:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:get:error', (_, err) => reject(err))
  })
}

export const playlists = (q) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:playlists', { token: store.getters['User/getToken'], ...q })
    ipcRenderer.on('youtube:playlists:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:playlists:error', (_, err) => reject(err))
  })
}
