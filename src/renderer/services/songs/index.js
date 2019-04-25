import { ipcRenderer } from 'electron'

export const get = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('songs:get')
    ipcRenderer.on('songs:get:response', (_, data) => resolve(data))
    ipcRenderer.on('songs:get:error', (_, err) => reject(err))
  })
}

export const play = (song) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('songs:play', song)
    ipcRenderer.on('songs:play:response', (_, data) => resolve(data))
    ipcRenderer.on('songs:play:error', (_, err) => reject(err))
  })
}

export const updateStatus = (running) => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('songs:status', running)
    ipcRenderer.on('songs:status:response', (_, data) => resolve(data))
    ipcRenderer.on('songs:status:error', (_, err) => reject(err))
  })
}
