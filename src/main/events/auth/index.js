import { genAuthUrl, store } from '../../services/auth'

export default {
  'auth:make': (_, req) => req.send('auth:make:response', genAuthUrl()),
  'auth:store': (token, req) => req.send('auth:store:response', store(token))
}
