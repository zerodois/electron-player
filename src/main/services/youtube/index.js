import { google } from 'googleapis'
import { oauth2Client } from '../auth'
import { get as find } from '../../services/songs'
import { promisify } from 'bluebird-lst'

export const get = async (query) => {
  oauth2Client.credentials = query.token
  var service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet',
    maxResults: 10,
    type: ''
  }
  Object.assign(config, query)
  let fn = promisify(service.search.list).bind(service)
  let response = await fn(config)
  let songs = (await find({}, { id: 1 })).map(it => it.id.videoId)
  response.data.items = response.data.items.map(item => {
    item.downloaded = songs.indexOf(item.id.videoId) > -1
    return item
  })
  return response.data.items
}
