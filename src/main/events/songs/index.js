import { get } from '../../services/songs'
import { update, status } from '../../services/system'

export default {
  'songs:get': async (_, req) => {
    let data = await get()
    req.send('songs:get:response', data)
  },
  'songs:play': async (item, res) => {
    update(item)
    res.send('songs:play:response', '')
  },
  'songs:status': async (running, res) => {
    status(running)
    res.send('songs:status:response', '')
  }
}
