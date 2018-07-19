import { get } from '../../services/youtube'

export default {
  'youtube:get': async (config, req) => {
    let data = await get(config)
    req.send('youtube:get:response', data)
  }
}
