import download from './download'
import auth from './auth'
import youtube from './youtube'

export default {
  ...download,
  ...auth,
  ...youtube
}
