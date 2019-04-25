import { get } from '../../services/songs'
import { update } from '../../services/system'

export default {
  'songs:get': async (_, req) => {
    let data = await get()
    req.send('songs:get:response', data)
  },
  'songs:play': async (item, res) => {
    update(item)
    res.send('songs:play:response', '')
  }
}
