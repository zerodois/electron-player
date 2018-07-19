import { genAuthUrl, decode } from '../../services/auth'

export default {
  'auth:make': (_, req) => req.send('auth:make:response', genAuthUrl()),
  'auth:decode': async (code, req) => {
    let token = await decode(code)
    req.send('auth:decode:response', token)
  }
}
