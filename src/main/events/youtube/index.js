import { get } from '../../services/youtube'

export default {
  'youtube:get': (q, req) => req.send('youtube:get:response', get(q))
}
