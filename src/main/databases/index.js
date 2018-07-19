import Datastore from 'nedb'
import { resolve } from 'path'

export default name => {
  return new Datastore({ filename: resolve('.', 'store', `${name}.db`), autoload: true })
}
