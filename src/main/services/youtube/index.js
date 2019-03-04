import { google } from 'googleapis'
import { oauth2Client } from '../auth'
import { get as find } from '../../services/songs'
import { promisify } from 'bluebird-lst'

export const get = async (query) => {
  oauth2Client.credentials = query.token
  let service = google.youtube('v3')
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

export const videos = async (q) => {
  oauth2Client.credentials = q.token
  let service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet,contentDetails',
    maxResults: 10
  }
  let fn = promisify(service.videos.list).bind(service)
  let response = await fn({ ...config, ...q })
  let songs = (await find({}, { id: 1 })).map(it => it.id.videoId)
  response.data.items = response.data.items.map(item => {
    item.downloaded = songs.indexOf(item.id.videoId) > -1 ? 1 : 0
    return item
  })
  return response.data
}

export const playlists = async (q) => {
  oauth2Client.credentials = q.token
  let service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet,status',
    maxResults: 10
  }
  let fn = promisify(service.playlists.list).bind(service)
  let response = await fn({ ...config, ...q })
  return response.data
}

export const put = ({ playlistId, videoId, token }) => {
  oauth2Client.credentials = token
  let service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet',
    resource: {
      snippet: {
        playlistId,
        resourceId: {
          kind: 'youtube#video',
          videoId
        }
      }
    }
  }
  let fn = promisify(service.playlistItems.insert).bind(service)
  return fn(config)
    .then(r => r.data)
}

export const remove = ({ id, token }) => {
  oauth2Client.credentials = token
  let service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    id
  }
  let fn = promisify(service.playlistItems.delete).bind(service)
  return fn(config)
    .then(r => r.data)
    .then(d => {
      console.log('REPOSTA --------->', JSON.stringify(d, null, 2))
      return d
    })
}

export const playlistItems = async (q) => {
  oauth2Client.credentials = q.token
  let service = google.youtube('v3')
  let config = {
    auth: oauth2Client,
    part: 'snippet,contentDetails',
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
