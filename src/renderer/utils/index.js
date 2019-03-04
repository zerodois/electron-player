import Vue from 'vue'
import { ipcRenderer } from 'electron'

export const to = promise => promise.then(data => [null, data]).catch(e => [e, null])
export const EventEmitter = new Vue()

const resolver = ({ fn, event, data }) => {
  ipcRenderer.removeAllListeners(`${event}:response`)
  ipcRenderer.removeAllListeners(`${event}:error`)
  fn(data)
}

/**
 * Create a promise communication with backend by event
 * @param {string} event
 * @param {any} data
 */
export const buildEvent = (event, data) => new Promise((resolve, reject) => {
  ipcRenderer.send(`${event}`, data)
  ipcRenderer.once(`${event}:response`, (_, resp) => (
    resolver({ event, fn: resolve, data: resp })
  ))
  ipcRenderer.once(`${event}:error`, (_, err) => (
    resolver({ event, fn: reject, data: err })
  ))
})
