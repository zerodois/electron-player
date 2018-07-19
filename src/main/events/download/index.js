import { download } from '../../services/download'
import { insert } from '../../services/songs'

export default {
  'download:do': async doc => {
    await download(doc.url)
    return insert(doc)
  }
}
