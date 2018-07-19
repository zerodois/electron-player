import { ipcRenderer, remote } from 'electron'
const { BrowserWindow } = remote

export const getUrl = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('auth:make')
    ipcRenderer.on('auth:make:response', (_, data) => resolve(data))
    ipcRenderer.on('auth:make:error', (_, err) => reject(err))
  })
}

export const decode = token => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('auth:decode', token)
    ipcRenderer.on('auth:decode:response', (_, data) => resolve(data))
    ipcRenderer.on('auth:decode:error', (_, err) => reject(err))
  })
}

export const auth = (url) => {
  let callbacks = { ok: _ => {}, err: _ => {} }
  let authWindow = new BrowserWindow({
    width: 650,
    height: 750,
    show: false,
    'node-integration': false,
    'web-security': false
  })
  authWindow.loadURL(url)
  authWindow.show()
  authWindow.webContents.on('will-navigate', (event, newUrl) => {
    if (/response=error/i.test(newUrl)) {
      authWindow.close()
      return callbacks.err()
    }
    if (/response=code%3D/.test(newUrl)) {
      authWindow.close()
      let response = /response=code%3D([\d]+)%2F([^&]+)/.exec(newUrl)
      callbacks.ok(`${response[1]}/${response[2]}`)
    }
  })
  authWindow.on('closed', () => {
    authWindow = null
  })
  let ret = {}
  ret.onSuccess = callback => {
    callbacks.ok = callback
    return ret
  }
  ret.onError = callback => {
    callbacks.err = callback
    return ret
  }
  return ret
}
