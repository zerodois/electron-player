import songs from '../../databases/songs'
import { promisify } from 'util'

export const get = (query = {}) => {
  let find = promisify(songs.find).bind(songs)
  return find(query)
}

export const insert = promisify(songs.insert).bind(songs)
