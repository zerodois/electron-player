import { remote } from 'electron'
import { buildEvent } from '../../utils'
const { BrowserWindow } = remote

export const getUrl = () => buildEvent('auth:make')

export const decode = token => buildEvent('auth:decode', token)

export const revoke = () => buildEvent('auth:revoke')

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
