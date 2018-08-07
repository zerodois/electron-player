import { get, playlists } from '../../services/youtube'

export default {
  'youtube:get': async (config, req) => {
    let data = await get(config)
    req.send('youtube:get:response', data)
  },
  'youtube:playlists': async (config, req) => {
    let data = await playlists(config)
    req.send('youtube:playlists:response', data)
  }
}
