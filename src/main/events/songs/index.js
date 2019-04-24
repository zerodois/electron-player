import { Tray } from 'electron'
import { get } from '../../services/songs'
import { resolve } from 'path'

export default {
  'songs:get': async (_, req) => {
    let data = await get()
    req.send('songs:get:response', data)
  },
  'songs:play': async ({ snippet }, res) => {
    const path = resolve(__static, 'images', 'icon.jpg')
    console.log('RESOLVE:', path)
    const tray = new Tray(path)
    tray.setToolTip(snippet.title)
    res.send('songs:play:response', '')
  }
}
