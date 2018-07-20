import { download } from '../../services/download'
import { insert } from '../../services/songs'

export default {
  'download:do': async (doc, res) => {
    await download(doc.url)
    doc.downloaded = true
    await insert(doc)
    res.send('download:do:response')
  }
}
