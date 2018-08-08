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
    type: 'video'
  }
  Object.assign(config, query)
  let fn = promisify(service.search.list).bind(service)
  let response = await fn(config)
  let songs = (await find({}, { id: 1 })).map(it => it.id.videoId)
  response.data.items = response.data.items.map(item => {
    item.downloaded = songs.indexOf(item.id.videoId) > -1 ? 1 : 0
    return item
  })
  return response.data
}

export const playlists = async (q) => {
  oauth2Client.credentials = q.token
  var service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet,status',
    maxResults: 10
  }
  let fn = promisify(service.playlists.list).bind(service)
  let response = await fn({ ...config, ...q })
  return response.data
}

export const playlistItems = async (q) => {
  oauth2Client.credentials = q.token
  var service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet,status',
    maxResults: 50
  }
  let fn = promisify(service.playlistItems.list).bind(service)
  let response = await fn({ ...config, ...q })
  let songs = (await find({}, { id: 1 })).map(it => it.id.videoId)
  response.data.items = response.data.items.map(item => {
    item.downloaded = songs.indexOf(item.id.videoId) > -1 ? 1 : 0
    return item
  })
  return response.data
}
