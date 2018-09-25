import { get, playlists, playlistItems, put } from '../../services/youtube'

export default {
  'youtube:get': async (config, req) => {
    let data = await get(config)
    req.send('youtube:get:response', data)
  },
  'youtube:playlists': async (config, req) => {
    let data = await playlists(config)
    req.send('youtube:playlists:response', data)
  },
  'youtube:put': async (config, res) => {
    let data = await put(config)
    res.send('youtube:put:response', data)
  },
  'youtube:playlist:items': async (config, req) => {
    let data = await playlistItems(config)
    req.send('youtube:playlist:items:response', data)
  }
}
