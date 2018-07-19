import { get } from '../../services/songs'

export default {
  'songs:get': async (_, req) => {
    let data = await get()
    req.send('songs:get:response', data)
  }
}
