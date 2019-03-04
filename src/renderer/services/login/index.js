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

export const revoke = () => {
  return new Promise((resolve, reject) => {
    ipcRenderer.send('auth:revoke')
    ipcRenderer.on('auth:revoke:response', (_, data) => resolve(data))
    ipcRenderer.on('auth:revoke:error', (_, err) => reject(err))
  })
}

export const auth = (url) => {
  let callbacks = { ok: _ => {}, err: _ => {} }
  const executeAuth = () => {
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
        let response = /response=code%3D([\d]+)%2F([^&]+)%26scope/.exec(newUrl)
        callbacks.ok(`${response[1]}/${response[2]}`)
        authWindow.close()
      }
    })
    authWindow.on('closed', () => {
      authWindow = null
    })
  }
  let ret = { do: executeAuth }
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
