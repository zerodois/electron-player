import songs from '../../databases/songs'
import { promisify } from 'util'

export const get = (query = {}, fields = {}) => {
  let find = promisify(songs.find).bind(songs)
  console.log('SEARCH', query, fields)
  return find(query, fields)
}

export const downloads = () => {
}

export const insert = promisify(songs.insert).bind(songs)
