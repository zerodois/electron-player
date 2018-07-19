import download from './download'
import auth from './auth'
import youtube from './youtube'
import songs from './songs'

export default {
  ...download,
  ...auth,
  ...youtube,
  ...songs
}
