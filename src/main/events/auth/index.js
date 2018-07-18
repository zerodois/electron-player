import { genAuthUrl } from '../../services/auth'

export default {
  'auth:make': (_, req) => req.send('auth:make:response', genAuthUrl())
}
