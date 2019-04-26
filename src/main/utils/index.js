import electron from 'electron'

export const to = promise => promise.then(d => [null, d]).catch(e => [e, null])

export const path = process.env.NODE_ENV !== 'development'
  ? electron.app.getPath('userData')
  : '.'
