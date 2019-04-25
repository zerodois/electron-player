'use strict'
import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import events from './events'
import fs from 'fs'
import path from 'path'
import './server'
import { load } from './services/system'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let storage = path.resolve('.', 'storage')
if (!fs.existsSync(storage)) {
  fs.mkdirSync(storage)
  fs.mkdirSync(path.resolve('.', 'storage', 'songs'))
  fs.mkdirSync(path.resolve('.', 'storage', 'meta'))
}

let store = path.resolve('.', 'store')
if (!fs.existsSync(store)) {
  fs.mkdirSync(store)
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1366,
    useContentSize: true
  })
  mainWindow.setMenu(null)

  mainWindow.loadURL(winURL)
  const sender = mainWindow.webContents
  load(mainWindow)

  const eventFactory = ev => (e, data) => {
    const error = (err) => {
      console.error(err)
      sender.send(`${ev}:error`, err.message)
    }
    const timeout = setTimeout(() => error({ message: 'Timeout' }), 6000)
    console.log(`event`, ev, data)
    setTimeout(() => (
      events[ev](data, sender)
        .then(() => clearTimeout(timeout))
        .catch(err => {
          clearTimeout(timeout)
          error(err)
        })
    ), 10)
  }

  for (let ev in events) {
    ipcMain.on(ev, eventFactory(ev))
  }

  globalShortcut.register('MediaNextTrack', _ => mainWindow.webContents.send('keyboard:next'))
  globalShortcut.register('MediaNextTrack', _ => mainWindow.webContents.send('keyboard:prev'))
  globalShortcut.register('MediaPlayPause', _ => mainWindow.webContents.send('keyboard:playpause'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
