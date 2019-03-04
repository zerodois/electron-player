import { ipcRenderer } from 'electron'
import store from '@/store'

export const search = q => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:get', q)
    ipcRenderer.on('youtube:get:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:get:error', (_, err) => reject(err))
  })
}

export const videos = q => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:videos', q)
    ipcRenderer.on('youtube:videos:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:videos:error', (_, err) => reject(err))
  })
}

export const put = (playlistId, videoId) => {
  return new Promise((resolve, reject) => {
    let token = store.getters['User/getToken']
    ipcRenderer.send('youtube:put', { token, playlistId, videoId })
    ipcRenderer.on('youtube:put:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:put:error', (_, err) => reject(err))
  })
}

export const remove = (id) => {
  return new Promise((resolve, reject) => {
    let token = store.getters['User/getToken']
    ipcRenderer.send('youtube:delete', { token, id })
    ipcRenderer.on('youtube:delete:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:delete:error', (_, err) => reject(err))
  })
}

export const playlists = (q) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:playlists', { token: store.getters['User/getToken'], ...q })
    ipcRenderer.on('youtube:playlists:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:playlists:error', (_, err) => reject(err))
  })
}

export const playlistItems = (q) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('youtube:playlist:items', { token: store.getters['User/getToken'], ...q })
    ipcRenderer.on('youtube:playlist:items:response', (_, data) => resolve(data))
    ipcRenderer.on('youtube:playlist:items:error', (_, err) => reject(err))
  })
}
