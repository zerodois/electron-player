import { genAuthUrl, decode, revoke } from '../../services/auth'

export default {
  'auth:make': async (_, res) => res.send('auth:make:response', genAuthUrl()),
  'auth:decode': async (code, res) => {
    let token = await decode(code)
    res.send('auth:decode:response', token)
  },
  'auth:revoke': async (_, res) => {
    let response = revoke()
    res.send('auth:revoke:response', response)
  }
}
